import { ForeignKeyBuilder, type PgColumn, pgSchema, primaryKey, type AnyPgColumn, type UpdateDeleteAction, index } from "drizzle-orm/pg-core";

export type ColumnsWithTable<TTableName extends string, TColumns extends PgColumn[]> = {
  [Key in keyof TColumns]: AnyPgColumn<{
    tableName: TTableName;
  }>;
};

export function foreignKey<
  TTableName extends string,
  TForeignTableName extends string,
  TColumns extends [
    AnyPgColumn<{
      tableName: TTableName;
    }>,
    ...AnyPgColumn<{
      tableName: TTableName;
    }>[],
  ],
>(
  config: {
    name?: string;
    columns: TColumns;
    foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
  },
  actions?: {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  }
): ForeignKeyBuilder {
  function mappedConfig() {
    const { name, columns, foreignColumns } = config;
    return {
      name,
      columns,
      foreignColumns,
    };
  }

  return new ForeignKeyBuilder(mappedConfig, actions);
}

export const boilermate = pgSchema("bm");

export const group = boilermate.table("group", (d) => ({
  id: d.bigserial("id", { mode: "number" }).primaryKey(),
  name: d.text().notNull(),
  dissolved: d.boolean().notNull().default(false),
}));

export const groupToUser = boilermate.table(
  "group_to_user",
  (d) => ({
    userId: d
      .text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    groupId: d
      .bigint("group_id", { mode: "number" })
      .references(() => group.id, { onDelete: "cascade" })
      .notNull(),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })]
);

export const country = boilermate.table("country", (d) => ({
  code: d.text("code").primaryKey(), // ISO code
  name: d.text("name").notNull(),
}));

export const school = boilermate.table("school", (d) => ({
  code: d.text("code").primaryKey(),
  name: d.text("name").notNull(),
}));

export const userProfile = boilermate.table(
  "user_profile",
  (d) => ({
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    age: d.smallint().notNull().default(0),
    countryCode: d.text("country_code").references(() => country.code, { onDelete: "set null" }),
    schoolCode: d.text("school_code").references(() => school.code, { onDelete: "set null" }),
    classNo: d.smallint().notNull(), // Class of 2029
  }),
  (t) => [index("user_profile_user_id_idx").on(t.userId)]
);

export const prefCategory = boilermate.table("pref_category", (d) => ({
  name: d.text("name").notNull().primaryKey(),
}));

export const prefCategoryOption = boilermate.table(
  "pref_category_option",
  (d) => ({
    categoryName: d
      .text("category_name")
      .references(() => prefCategory.name, { onDelete: "cascade" })
      .notNull(),
    name: d.text("name").notNull(),
  }),
  (t) => [index("pref_category_option_name_idx").on(t.categoryName), primaryKey({ columns: [t.categoryName, t.name] })]
);

export const userPreferences = boilermate.table(
  "user_prefs",
  (d) => ({
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryName: d
      .text("category_name")
      .references(() => prefCategory.name)
      .notNull(),
    option: d.text("option").notNull(),
  }),
  (t) => [
    index("user_pref_user_id").on(t.userId),
    primaryKey({ columns: [t.userId, t.categoryName] }),
    foreignKey(
      {
        columns: [t.categoryName, t.option],
        foreignColumns: [prefCategoryOption.categoryName, prefCategoryOption.name],
      },
      { onDelete: "cascade" }
    ),
  ]
);

export const user = boilermate.table("user", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull().unique(),
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
