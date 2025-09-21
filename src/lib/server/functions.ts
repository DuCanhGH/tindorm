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
import { and, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { country, school, user, userProfile, userRating, userSwipe } from "$lib/server/db/schema";
import { jsonBuildObject } from "$lib/server/db/utils";
import { SWIPE_TYPE } from "$lib/constants";

const zSwipeType = z.enum(SWIPE_TYPE);

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
  await db
    .insert(userSwipe)
    .values({ userId: locals.user.id, targetId: input.userId, type: input.type })
    .onConflictDoUpdate({
      target: [userSwipe.userId, userSwipe.targetId],
      set: {
        type: input.type,
      },
    });
});

export const getSwipes = query(zSwipeType, async (input) => {
  const { locals } = getRequestEvent();
  if (!locals.user) {
    return { ok: false, code: 401, message: "You must be signed in to see your swipes!" };
  }
  return await db
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
    .groupBy(user.id, user.name, userProfile.dob, country.code, country.name, school.code, school.name, userProfile.classNo);
});
