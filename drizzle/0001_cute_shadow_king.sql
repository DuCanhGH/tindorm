CREATE TABLE "bm"."country" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bm"."school" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bm"."user_profile" (
	"user_id" text NOT NULL,
	"age" smallint DEFAULT 0 NOT NULL,
	"country_code" text,
	"school_code" text,
	"classNo" smallint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "bm"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD CONSTRAINT "user_profile_country_code_country_code_fk" FOREIGN KEY ("country_code") REFERENCES "bm"."country"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD CONSTRAINT "user_profile_school_code_school_code_fk" FOREIGN KEY ("school_code") REFERENCES "bm"."school"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user" ADD CONSTRAINT "user_name_unique" UNIQUE("name");