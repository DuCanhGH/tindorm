import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, sql } from "drizzle-orm";
import { country, prefCategory, prefCategoryOption, userProfile } from "$lib/server/db/schema";
import { jsonAgg } from "$lib/server/db/utils";

export const load: PageServerLoad = async ({ locals }) => {
  return await db.transaction(async (tx) => {
    if (!locals.user) {
      redirect(303, "/");
    }
    const [{ hasUserProfile }] = await tx.execute<{ hasUserProfile: boolean }>(sql`SELECT EXISTS (
      SELECT 1 FROM ${userProfile}
      WHERE ${eq(userProfile.userId, locals.user.id)}
    ) AS "hasUserProfile"`);
    if (hasUserProfile) {
      redirect(303, "/");
    }
    const countries = await tx.select({ code: country.code, name: country.name }).from(country);
    const prefs = await tx
      .select({
        name: prefCategory,
        options: jsonAgg({
          name: prefCategoryOption.name,
        }),
      })
      .from(prefCategory)
      .innerJoin(prefCategoryOption, eq(prefCategoryOption.categoryName, prefCategory.name))
      .groupBy(prefCategory.name);
    return { countries, prefs };
  });
};
