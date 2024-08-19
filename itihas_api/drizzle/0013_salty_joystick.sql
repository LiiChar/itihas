ALTER TABLE `histories` ADD `status` text DEFAULT 'announcement' NOT NULL;--> statement-breakpoint
ALTER TABLE `histories` ADD `type` text DEFAULT 'free' NOT NULL;