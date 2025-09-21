ALTER TABLE "bm"."user_profile" RENAME COLUMN "classNo" TO "class_no";--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD COLUMN "dob" date NOT NULL;--> statement-breakpoint
ALTER TABLE "bm"."user_profile" DROP COLUMN "age";