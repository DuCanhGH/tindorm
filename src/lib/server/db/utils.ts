import { type SQL, sql, is, type SelectedFields } from "drizzle-orm";
import { PgTimestampString } from "drizzle-orm/pg-core";
import type { SelectResultFields } from "drizzle-orm/query-builders/select.types";

/**
 * Source: https://github.com/drizzle-team/drizzle-orm/issues/2050#issuecomment-2184920843
 * @param shape
 * @returns
 */
export function jsonBuildObject<T extends SelectedFields<any, any>>(shape: T) {
  const chunks: SQL[] = [];

  const shapeArray = Object.entries(shape);

  if (shapeArray.length === 0) {
    return sql<SelectResultFields<T> | null>`'{}'::jsonb`;
  }

  const firstColumn = shapeArray[0]?.[1];

  shapeArray.forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }

    chunks.push(sql.raw(`'${key}',`));

    // json_build_object formats to ISO 8601 ...
    if (is(value, PgTimestampString)) {
      chunks.push(sql`timezone('UTC', ${value})`);
    } else {
      chunks.push(sql`${value}`);
    }
  });

  return sql<SelectResultFields<T> | null>`CASE
    WHEN ${firstColumn} IS NULL THEN NULL
    ELSE coalesce(jsonb_build_object(${sql.join(chunks)}), '{}'::jsonb)
  END`;
}

/**
 * Aggregates rows based on shape (`key` -> `value`). Filter out rows where
 * the first `value` is `NULL`.
 * @param shape
 * @returns
 */
export function jsonAgg<T extends SelectedFields<any, any>>(shape: T) {
  const chunks: SQL[] = [];

  const shapeArray = Object.entries(shape);

  const firstColumn = shapeArray[0]?.[1];

  shapeArray.forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }

    chunks.push(sql.raw(`'${key}',`));

    // json_build_object formats to ISO 8601 ...
    if (is(value, PgTimestampString)) {
      chunks.push(sql`timezone('UTC', ${value})`);
    } else {
      chunks.push(sql`${value}`);
    }
  });

  return sql<
    SelectResultFields<T>[]
  >`coalesce(jsonb_agg(jsonb_build_object(${sql.join(chunks)})) ${firstColumn ? sql`FILTER (WHERE ${firstColumn} IS NOT NULL)` : sql``}, '[]'::JSONB)`;
}
