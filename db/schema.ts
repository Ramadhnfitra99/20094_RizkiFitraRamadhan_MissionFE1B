import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const savedMovies = sqliteTable(
  "saved_movies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ownerId: text("owner_id").notNull(),
    movieId: text("movie_id").notNull(),
    title: text("title").notNull(),
    image: text("image").notNull(),
    badge: text("badge", { enum: ["new", "top", "premium"] }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("saved_movies_owner_movie_unique").on(
      table.ownerId,
      table.movieId,
    ),
  ],
);
