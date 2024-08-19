import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './scheme';
import { users } from '../entities/user/user';

const sqlite = new Database('database.sqlite');
export const db = drizzle(sqlite, { schema });

export type UserType = typeof users.$inferSelect;
export type UserInsertType = typeof users.$inferInsert;
export type HistoryType = typeof schema.histories.$inferSelect;
export type HistoryInsertType = typeof schema.histories.$inferInsert;
export type PageType = typeof schema.pages.$inferSelect;
export type PageInsertType = typeof schema.pages.$inferInsert;
export type PointPageType = typeof schema.pagePoints.$inferSelect;
export type PointPageInsertType = typeof schema.pagePoints.$inferInsert;
export type CommentType = typeof schema.comments.$inferSelect;
export type CommentInsertType = typeof schema.comments.$inferInsert;
export type VariableType = typeof schema.variables.$inferSelect;
export type VariableInsertType = typeof schema.variables.$inferInsert;
export type GenreType = typeof schema.genres.$inferSelect;
export type GenreInsertType = typeof schema.genres.$inferInsert;
export type SimilarType = typeof schema.similarHistories.$inferSelect;
export type SimilarInsertType = typeof schema.similarHistories.$inferInsert;
export type BookmarkType = typeof schema.bookmarks.$inferSelect;
export type BookmarkInsertType = typeof schema.bookmarks.$inferInsert;
export type BookmarkToHistoryType =
	typeof schema.bookmarksToHistories.$inferSelect;
export type BookmarkToHistoryInsertType =
	typeof schema.bookmarksToHistories.$inferInsert;
