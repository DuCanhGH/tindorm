CREATE TYPE "bm"."merge_approval_side" AS ENUM('src', 'tgt');--> statement-breakpoint
CREATE TYPE "bm"."merge_request_status" AS ENUM('await_src', 'await_tgt', 'merge_pending', 'merged', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TABLE "bm"."major" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bm"."merge_approval" (
	"merge_request_id" bigint NOT NULL,
	"approver_user_id" text NOT NULL,
	"side" "bm"."merge_approval_side" NOT NULL,
	"approved" boolean NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "merge_approval_merge_request_id_approver_user_id_pk" PRIMARY KEY("merge_request_id","approver_user_id")
);
--> statement-breakpoint
CREATE TABLE "bm"."merge_request" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"initiator_user_id" text NOT NULL,
	"source_group_id" bigint NOT NULL,
	"target_group_id" bigint NOT NULL,
	"status" "bm"."merge_request_status" NOT NULL,
	"source_snapshot" jsonb NOT NULL,
	"target_snapshot" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bm"."group" ADD COLUMN "dissolved_at" timestamp;--> statement-breakpoint
ALTER TABLE "bm"."group" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bm"."group_to_user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD COLUMN "major_code" text;--> statement-breakpoint
ALTER TABLE "bm"."merge_approval" ADD CONSTRAINT "merge_approval_merge_request_id_merge_request_id_fk" FOREIGN KEY ("merge_request_id") REFERENCES "bm"."merge_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."merge_approval" ADD CONSTRAINT "merge_approval_approver_user_id_user_id_fk" FOREIGN KEY ("approver_user_id") REFERENCES "bm"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."merge_request" ADD CONSTRAINT "merge_request_initiator_user_id_user_id_fk" FOREIGN KEY ("initiator_user_id") REFERENCES "bm"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."merge_request" ADD CONSTRAINT "merge_request_source_group_id_group_id_fk" FOREIGN KEY ("source_group_id") REFERENCES "bm"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."merge_request" ADD CONSTRAINT "merge_request_target_group_id_group_id_fk" FOREIGN KEY ("target_group_id") REFERENCES "bm"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD CONSTRAINT "user_profile_major_code_major_code_fk" FOREIGN KEY ("major_code") REFERENCES "bm"."major"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bm"."group" DROP COLUMN "dissolved";--> statement-breakpoint
ALTER TABLE "bm"."user_profile" ADD CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id");