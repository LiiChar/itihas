CREATE TABLE `like_to_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`history_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`variant` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`history_id`) REFERENCES `histories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
