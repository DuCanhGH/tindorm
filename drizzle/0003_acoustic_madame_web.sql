CREATE TYPE "bm"."swipe_type" AS ENUM('left', 'right');--> statement-breakpoint
CREATE TABLE "bm"."user_rating" (
	"user_id" text NOT NULL,
	"reviewer_id" text,
	"star" smallint NOT NULL,
	"review" text NOT NULL,
	CONSTRAINT "user_rating_user_id_reviewer_id_pk" PRIMARY KEY("user_id","reviewer_id")
);
--> statement-breakpoint
CREATE TABLE "bm"."user_swipe" (
	"user_id" text NOT NULL,
	"target_id" text NOT NULL,
	"type" "bm"."swipe_type" NOT NULL,
	CONSTRAINT "user_swipe_user_id_target_id_pk" PRIMARY KEY("user_id","target_id")
);
--> statement-breakpoint
ALTER TABLE "bm"."user_prefs" DROP CONSTRAINT "user_prefs_category_name_pref_category_name_fk";
--> statement-breakpoint
ALTER TABLE "bm"."user_rating" ADD CONSTRAINT "user_rating_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "bm"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_rating" ADD CONSTRAINT "user_rating_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "bm"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_swipe" ADD CONSTRAINT "user_swipe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "bm"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_swipe" ADD CONSTRAINT "user_swipe_target_id_user_id_fk" FOREIGN KEY ("target_id") REFERENCES "bm"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_prefs" ADD CONSTRAINT "user_prefs_category_name_pref_category_name_fk" FOREIGN KEY ("category_name") REFERENCES "bm"."pref_category"("name") ON DELETE cascade ON UPDATE no action;