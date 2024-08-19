CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`photo` text DEFAULT '/public/assets/guest.png',
	`verify` integer DEFAULT false NOT NULL,
	`location` text,
	`about` text,
	`role` text DEFAULT 'user' NOT NULL,
	`email` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_name_unique` ON `users` (`name`);