import { pgSchema } from "drizzle-orm/pg-core";

export const boilermate = pgSchema("bm");

export const user = boilermate.table("user", (d) => ({
  id: d.text("id").primaryKey(),
  age: d.integer("age"),
  username: d.text("username").notNull().unique(),
  passwordHash: d.text("password_hash").notNull(),
}));

export const session = boilermate.table("session", (d) => ({
  id: d.text("id").primaryKey(),
  userId: d
    .text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: d.timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
}));

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
