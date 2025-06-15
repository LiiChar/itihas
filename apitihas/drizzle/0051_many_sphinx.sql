CREATE TABLE `battle_participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`battle_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`battle_id`) REFERENCES `battles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `battle_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`battle_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	`damage_dealt` integer DEFAULT 0 NOT NULL,
	`damage_received` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`battle_id`) REFERENCES `battles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `battles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`ended_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `characters` ADD `attack` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `characters` ADD `armor` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `characters` ADD `health` integer DEFAULT 0;