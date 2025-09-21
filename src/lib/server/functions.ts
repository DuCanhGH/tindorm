// To use these functions, create a file called `fn.remote.ts` next to the call site
// and add the following:
// ```ts
// export { rateUser } from "$lib/server/functions";
// ```
// then import the function from `fn.remote.ts`:
// ```svelte
// import { rateUser } from "./fn.remote";
// ```
// This is a workaround
import { command, form, getRequestEvent, query } from "$app/server";
import z from "zod";
import { and, eq, or, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import {
  country,
  group,
  groupMember,
  mergeApproval,
  mergeRequest,
  school,
  user,
  userPreferences,
  userProfile,
  userRating,
  userSwipe,
} from "$lib/server/db/schema";
import { jsonBuildObject } from "$lib/server/db/utils";
import { SWIPE_TYPE } from "$lib/constants";

const zSwipeType = z.enum(SWIPE_TYPE);

export const createUserProfile = form(
  z.object({
    dob: z.iso.date(),
    country: z.string(),
    school: z.string(),
    major: z.string(),
    class: z
      .string()
      .transform((s) => Number(s))
      .pipe(z.int().min(2000).max(2100)),
    preferences: z.record(z.string(), z.string()),
  }),
  async (input) => {
    const { locals } = getRequestEvent();
    if (!locals.user) {
      return { ok: false, code: 401, message: "You must be signed in to edit your profile!" };
    }
    const uid = locals.user.id;
    try {
      return await db.transaction(async (tx) => {
        await tx.insert(userProfile).values({
          userId: uid,
          dob: input.dob,
          countryCode: input.country,
          schoolCode: input.school,
          majorCode: input.major,
          classNo: input.class, // Class of 2029
        });
        await tx.insert(userPreferences).values(
          Object.values(input.preferences).map((pref) => ({
            userId: uid,
            categoryName: pref[0],
            option: pref[1],
          }))
        );
      });
    } catch (err) {
      console.error("[createUserProfile] Internal Server Error:", err);
      return { ok: false, code: 500, message: "Internal Server Error" };
    }
  }
);

export const editUserProfile = form(
  z.object({
    dob: z.iso.date().optional(),
    country: z.string().optional(),
    school: z.string().optional(),
    major: z.string().optional(),
    class: z
      .string()
      .transform((s) => Number(s))
      .pipe(z.int().min(2000).max(2100))
      .optional(),
    preferences: z.record(z.string(), z.string()).optional(),
  }),
  async (input) => {
    const { locals } = getRequestEvent();
    if (!locals.user) {
      return { ok: false, code: 401, message: "You must be signed in to edit your profile!" };
    }
    const uid = locals.user.id;
    try {
      return await db.transaction(async (tx) => {
        await tx
          .update(userProfile)
          .set({
            dob: input.dob,
            countryCode: input.country,
            schoolCode: input.school,
            majorCode: input.major,
            classNo: input.class, // Class of 2029
          })
          .where(eq(userProfile.userId, uid));
        if (input.preferences) {
          await tx
            .insert(userPreferences)
            .values(
              Object.values(input.preferences).map((pref) => ({
                userId: uid,
                categoryName: pref[0],
                option: pref[1],
              }))
            )
            .onConflictDoUpdate({
              target: [userPreferences.userId, userPreferences.categoryName],
              set: {
                option: sql`EXCLUDED.option`,
              },
            });
        }
      });
    } catch (err) {
      console.error("[editUserProfile] Internal Server Error:", err);
      return { ok: false, code: 500, message: "Internal Server Error" };
    }
  }
);

/**
 * Rate this user.
 */
export const rateUser = form(
  z.object({
    userId: z.string(),
    star: z
      .string()
      .transform((s) => Number(s))
      .pipe(z.int().min(1).max(5)),
    review: z.string(),
  }),
  async (input) => {
    const { locals } = getRequestEvent();
    if (!locals.user) {
      return { ok: false, code: 401, message: "You must be signed in to review someone!" };
    }
    try {
      await db
        .insert(userRating)
        .values({ ...input, reviewerId: locals.user.id })
        .onConflictDoUpdate({
          target: [userRating.userId, userRating.reviewerId],
          set: {
            star: input.star,
            review: input.review,
          },
        });
      return { ok: true };
    } catch (err) {
      console.error("[rateUser] Internal Server Error:", err);
      return { ok: false, code: 500, message: "Internal Server Error" };
    }
  }
);

/**
 * Adds an user to the rejected list to prevent reappearance.
 */
export const swipe = command(z.object({ userId: z.string(), type: zSwipeType }), async (input) => {
  const { locals } = getRequestEvent();
  if (!locals.user) {
    return { ok: false, code: 401, message: "You must be signed in to swipe someone!" };
  }
  try {
    await db
      .insert(userSwipe)
      .values({ userId: locals.user.id, targetId: input.userId, type: input.type })
      .onConflictDoUpdate({
        target: [userSwipe.userId, userSwipe.targetId],
        set: {
          type: input.type,
        },
      });
    return { ok: true };
  } catch (err) {
    console.error("[swipe] Internal Server Error:", err);
    return { ok: false, code: 500, message: "Internal Server Error" };
  }
});

/**
 * Get a list of swipes.
 */
export const getSwipes = query(zSwipeType, async (input) => {
  const { locals } = getRequestEvent();
  if (!locals.user) {
    return { ok: false, code: 401, message: "You must be signed in to see your swipes!" };
  }
  try {
    return {
      ok: true,
      data: await db
        .select({
          id: user.id,
          name: user.name,
          info: jsonBuildObject({
            dob: userProfile.dob,
            country: jsonBuildObject({
              code: country.code,
              name: country.name,
            }),
            school: jsonBuildObject({
              code: school.code,
              name: school.name,
            }),
            classNo: userProfile.classNo,
          }),
        })
        .from(userSwipe)
        .innerJoin(user, eq(user.id, userSwipe.targetId))
        .innerJoin(userProfile, eq(userProfile.userId, user.id))
        .innerJoin(country, eq(country.code, userProfile.countryCode))
        .innerJoin(school, eq(school.code, userProfile.schoolCode))
        .where(and(eq(userSwipe.userId, locals.user.id), eq(userSwipe.type, input)))
        .groupBy(user.id, user.name, userProfile.dob, country.code, country.name, school.code, school.name, userProfile.classNo),
    };
  } catch (err) {
    console.error("[getSwipes] Internal Server Error:", err);
    return { ok: false, code: 500, message: "Internal Server Error" };
  }
});

/**
 * Send a merge request to another user.
 */
export const sendMergeRequest = form(
  z.object({
    from: z
      .string()
      .transform((s) => Number(s))
      .pipe(z.int()),
    to: z
      .string()
      .transform((s) => Number(s))
      .pipe(z.int()),
  }),
  async (input) => {
    const { locals } = getRequestEvent();
    try {
      return await db.transaction(async (tx) => {
        if (!locals.user) {
          return { ok: false, code: 401, message: "You must be signed in to send a match request!" };
        }
        const [{ existingRequest }] = await tx.execute<{ existingRequest: boolean }>(
          sql`SELECT EXISTS (SELECT 1 FROM ${mergeRequest} WHERE ${or(
            and(eq(mergeRequest.sourceGroupId, input.from), eq(mergeRequest.targetGroupId, input.to)),
            and(eq(mergeRequest.sourceGroupId, input.to), eq(mergeRequest.targetGroupId, input.from))
          )}) AS "existingRequest"`
        );
        if (existingRequest) {
          return { ok: false, code: 400, message: "There already is an existing request!" };
        }
        const initiatorUid = locals.user.id;
        const [{ isMember }] = await tx.execute<{ isMember: boolean }>(sql`
          SELECT EXISTS (
            SELECT 1 FROM {groupMember} WHERE ${and(eq(groupMember.groupId, input.from), eq(groupMember.userId, initiatorUid))}
          ) AS "isMember"
        `);
        if (!isMember) {
          return { ok: false, code: 403, message: "Unauthorized" };
        }
        const srcMembers = await tx.select({ userId: groupMember.userId }).from(groupMember).where(eq(groupMember.groupId, input.from));
        const tgtMembers = await tx.select({ userId: groupMember.userId }).from(groupMember).where(eq(groupMember.groupId, input.to));
        if (srcMembers.length === 0 || tgtMembers.length === 0) {
          return { ok: false, code: 409, message: "Both groups must have at least 1 member to merge" };
        }
        const sourceSnapshot = srcMembers.map((mem) => mem.userId);
        const targetSnapshot = tgtMembers.map((mem) => mem.userId);
        const [{ id }] = await tx
          .insert(mergeRequest)
          .values({
            initiatorUserId: initiatorUid,
            sourceGroupId: input.from,
            targetGroupId: input.to,
            status: "await_src",
            sourceSnapshot,
            targetSnapshot,
          })
          .returning({ id: mergeRequest.id });
        return { ok: true, mrId: id };
      });
    } catch (err) {
      console.error("[sendMergeRequest] Internal Server Error:", err);
      return { ok: false, code: 500, message: "Internal Server Error" };
    }
  }
);

/**
 * Accept a merge request.
 */
export const acceptMergeRequest = form(
  z.object({
    id: z
      .string()
      .transform((s) => Number(s))
      .pipe(z.int()),
    approved: z.stringbool(),
  }),
  async (input) => {
    const { locals } = getRequestEvent();
    try {
      return await db.transaction(async (tx) => {
        if (!locals.user) {
          return { ok: false, code: 401, message: "You must be signed in to accept a merge request!" };
        }

        const uid = locals.user.id;

        const [mr] = await tx
          .select({
            sourceGroupId: mergeRequest.sourceGroupId,
            targetGroupId: mergeRequest.targetGroupId,
            status: mergeRequest.status,
            sourceSnapshot: mergeRequest.sourceSnapshot,
            targetSnapshot: mergeRequest.targetSnapshot,
          })
          .from(mergeRequest)
          .where(eq(mergeRequest.id, input.id));

        if (!mr) {
          return { ok: false, code: 409, message: "Merge request not found." };
        }

        if (mr.status === "rejected" || mr.status === "merged") {
          return { ok: false, code: 409, message: "Merge request is no longer active." };
        }

        const side = mr.status === "await_src" ? "src" : mr.status === "await_tgt" ? "tgt" : null;

        if (!side) {
          return { ok: false, code: 409, message: "Merge request no longer open for approval." };
        }

        const snapshot = (side === "src" ? mr.sourceSnapshot : mr.targetSnapshot) as string[];

        if (!snapshot.includes(uid)) {
          return { ok: false, code: 409, message: "User is not in required approvers for this phase." };
        }

        await tx
          .insert(mergeApproval)
          .values({
            mergeRequestId: input.id,
            approverUserId: uid,
            side,
            approved: input.approved,
          })
          .onConflictDoUpdate({
            target: [mergeApproval.mergeRequestId, mergeApproval.approverUserId],
            set: { approved: input.approved, createdAt: new Date() },
          });

        // check if all required approvers for side have approved
        const approvals = await tx
          .select({ approverUserId: mergeApproval.approverUserId, approved: mergeApproval.approved })
          .from(mergeApproval)
          .where(and(eq(mergeApproval.mergeRequestId, input.id), eq(mergeApproval.side, side)));

        const approvedSet = new Set(approvals.filter((a) => a.approved).map((a) => a.approverUserId));

        const allApproved = snapshot.every((id) => approvedSet.has(id));

        if (!allApproved) {
          // immediately reject if any approved === false (veto)
          const anyReject = approvals.some((a) => a.approved === false);
          if (anyReject) {
            await tx.update(mergeRequest).set({ status: "rejected", updatedAt: new Date() }).where(eq(mergeRequest.id, input.id));
            return { ok: true, mergeStatus: "rejected" };
          }
          return { ok: true, mergeStatus: mr.status };
        }

        // source side done -> advance to target approvals
        if (side === "src") {
          await tx.update(mergeRequest).set({ status: "await_tgt", updatedAt: new Date() }).where(eq(mergeRequest.id, input.id));
          return { mergeStatus: "await_tgt" };
        }

        // target side done -> finalize merge
        if (side === "tgt") {
          // move members
          await tx.update(groupMember).set({ groupId: mr.targetGroupId }).where(eq(groupMember.groupId, mr.sourceGroupId));
          // dissolve
          await tx.update(group).set({ dissolvedAt: new Date() }).where(eq(group.id, mr.sourceGroupId));
          // merged
          await tx.update(mergeRequest).set({ status: "merged", updatedAt: new Date() }).where(eq(mergeRequest, input.id));
          return { ok: true, mergeStatus: "merged" };
        }
      });
    } catch (err) {
      console.error("[acceptMergeRequest] Internal Server Error:", err);
      return { ok: false, code: 500, message: "Internal Server Error" };
    }
  }
);
