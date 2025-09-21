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
import { country, matchRequest, school, user, userPreferences, userProfile, userRating, userSwipe } from "$lib/server/db/schema";
import { jsonBuildObject } from "$lib/server/db/utils";
import { SWIPE_TYPE } from "$lib/constants";

const zSwipeType = z.enum(SWIPE_TYPE);

export const createUserProfile = form(
  z.object({
    dob: z.iso.date(),
    country: z.string(),
    school: z.string(),
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
 * Send a match request to another user.
 */
export const sendMatchRequest = form(z.object({ to: z.string() }), (input) => {
  const { locals } = getRequestEvent();
  return db.transaction(async (tx) => {
    if (!locals.user) {
      return { ok: false, code: 401, message: "You must be signed in to send a match request!" };
    }
    const [{ existingRequest }] = await tx.execute<{ existingRequest: boolean }>(
      sql`SELECT EXISTS (SELECT 1 FROM ${matchRequest} WHERE ${or(
        and(eq(matchRequest.toId, input.to), eq(matchRequest.fromId, locals.user.id)),
        and(eq(matchRequest.toId, locals.user.id), eq(matchRequest.fromId, input.to))
      )}) AS existingRequest`
    );
    if (existingRequest) {
      return { ok: false, code: 400, message: "There already is an existing request!" };
    }
    try {
      await tx.insert(matchRequest).values({ fromId: locals.user.id, toId: input.to }).onConflictDoNothing();
    } catch (err) {
      console.error("[sendMatchRequest] Internal Server Error:", err);
      return { ok: false, code: 500, message: "Internal Server Error" };
    }
  });
});

export const acceptMatchRequest = form(z.object({ with: z.string() }), (input) => {});
