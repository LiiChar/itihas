ALTER TABLE `characters` ADD `author_id` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `characters_to_users` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/