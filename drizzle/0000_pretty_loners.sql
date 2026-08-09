CREATE TABLE `saved_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`movie_id` text NOT NULL,
	`title` text NOT NULL,
	`image` text NOT NULL,
	`badge` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `saved_movies_owner_movie_unique` ON `saved_movies` (`owner_id`,`movie_id`);