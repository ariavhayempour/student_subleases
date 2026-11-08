ALTER TABLE "schools" ADD COLUMN "sort_order" smallint DEFAULT 100 NOT NULL;--> statement-breakpoint
UPDATE "schools" SET "sort_order" = 0 WHERE "slug" = 'uw-madison';
