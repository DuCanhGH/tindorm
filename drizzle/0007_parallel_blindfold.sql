ALTER TABLE "bm"."user" DROP CONSTRAINT "user_name_unique";--> statement-breakpoint
ALTER TABLE "bm"."merge_request" ADD COLUMN "receiver_user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bm"."merge_request" ADD CONSTRAINT "merge_request_receiver_user_id_user_id_fk" FOREIGN KEY ("receiver_user_id") REFERENCES "bm"."user"("id") ON DELETE no action ON UPDATE no action;