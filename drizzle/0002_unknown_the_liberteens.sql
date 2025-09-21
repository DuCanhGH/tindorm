CREATE TABLE "bm"."group" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"dissolved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bm"."group_to_user" (
	"user_id" text NOT NULL,
	"group_id" bigint NOT NULL,
	CONSTRAINT "group_to_user_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "bm"."pref_category" (
	"name" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bm"."pref_category_option" (
	"category_name" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "pref_category_option_category_name_name_pk" PRIMARY KEY("category_name","name")
);
--> statement-breakpoint
CREATE TABLE "bm"."user_prefs" (
	"user_id" text NOT NULL,
	"category_name" text NOT NULL,
	"option" text NOT NULL,
	CONSTRAINT "user_prefs_user_id_category_name_pk" PRIMARY KEY("user_id","category_name")
);
--> statement-breakpoint
ALTER TABLE "bm"."group_to_user" ADD CONSTRAINT "group_to_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "bm"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."group_to_user" ADD CONSTRAINT "group_to_user_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "bm"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."pref_category_option" ADD CONSTRAINT "pref_category_option_category_name_pref_category_name_fk" FOREIGN KEY ("category_name") REFERENCES "bm"."pref_category"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_prefs" ADD CONSTRAINT "user_prefs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "bm"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_prefs" ADD CONSTRAINT "user_prefs_category_name_pref_category_name_fk" FOREIGN KEY ("category_name") REFERENCES "bm"."pref_category"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_prefs" ADD CONSTRAINT "user_prefs_category_name_option_pref_category_option_category_name_name_fk" FOREIGN KEY ("category_name","option") REFERENCES "bm"."pref_category_option"("category_name","name") ON DELETE cascade;--> statement-breakpoint
CREATE INDEX "pref_category_option_name_idx" ON "bm"."pref_category_option" USING btree ("category_name");--> statement-breakpoint
CREATE INDEX "user_pref_user_id" ON "bm"."user_prefs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profile_user_id_idx" ON "bm"."user_profile" USING btree ("user_id");