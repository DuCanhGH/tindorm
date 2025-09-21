import { pgSchema, primaryKey } from "drizzle-orm/pg-core";

export const boilermate = pgSchema("bm");

// export const country = boilermate.table("country", (d) => ({
//   code: d.text("code").primaryKey(), // ISO code
//   name: d.text("name").notNull(),
// }));

// export const userProfile = boilermate.table("user_profile", (d) => ({
//   userId: d
//     .text("user_id")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),
//   age: d.smallint().notNull().default(0),
//   countryCode: d.text("country_code").references(() => country.code, { onDelete: "set null" }),
// }));

export const user = boilermate.table("user", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d.boolean("email_verified").default(false).notNull(),
  image: d.text("image"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const session = boilermate.table("session", (d) => ({
  id: d.text("id").primaryKey(),
  expiresAt: d.timestamp("expires_at").notNull(),
  token: d.text("token").notNull().unique(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: d.text("ip_address"),
  userAgent: d.text("user_agent"),
  userId: d
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

export const account = boilermate.table("account", (d) => ({
  id: d.text("id").primaryKey(),
  accountId: d.text("account_id").notNull(),
  providerId: d.text("provider_id").notNull(),
  userId: d
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: d.text("access_token"),
  refreshToken: d.text("refresh_token"),
  idToken: d.text("id_token"),
  accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
  scope: d.text("scope"),
  password: d.text("password"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const verification = boilermate.table("verification", (d) => ({
  id: d.text("id").primaryKey(),
  identifier: d.text("identifier").notNull(),
  value: d.text("value").notNull(),
  expiresAt: d.timestamp("expires_at").notNull(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const userRating = boilermate.table(
  "user_rating",
  (d) => ({
    userId: d.text("user_Id"),
    reviewerId: d.text("reviewer_Id"),
    star: d.smallint("star").notNull(),
    review: d.text("review").notNull(),
    isRoommate: d.boolean("is_roommate").notNull(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.reviewerId] })]
);
