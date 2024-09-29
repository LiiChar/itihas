import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './scheme';
import { users } from '../entities/user/model/user';

const sqlite = new Database('database.sqlite');
export const db = drizzle(sqlite, { schema });

export type LikePageType = typeof schema.likePages.$inferSelect;
export type LikePageInsertType = typeof schema.likePages.$inferInsert;
export type CharactersToUserType = typeof schema.charactersToUsers.$inferSelect;
export type CharactersToUserInsertType =
	typeof schema.charactersToUsers.$inferInsert;
export type CharactersType = typeof schema.characters.$inferSelect;
export type CharactersInsertType = typeof schema.characters.$inferInsert;
export type DignityType = typeof schema.dignity.$inferSelect;
export type DignityInsertType = typeof schema.dignity.$inferInsert;
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
export type ReplyCommentType = typeof schema.commentsToComments.$inferSelect;
export type ReplyCommentInsertType =
	typeof schema.commentsToComments.$inferInsert;
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
