/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `battle_participants` ADD `team` text;--> statement-breakpoint
ALTER TABLE `battle_results` ADD `result` text;--> statement-breakpoint
ALTER TABLE `battle_results` DROP COLUMN `character_id`;--> statement-breakpoint
ALTER TABLE `battle_results` DROP COLUMN `damage_dealt`;--> statement-breakpoint
ALTER TABLE `battle_results` DROP COLUMN `damage_received`;