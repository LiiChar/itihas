import { relations, sql } from 'drizzle-orm';
import { users } from '../../user/model/user';
import { histories } from '../../history/model/history';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bookmarks = sqliteTable('bookmarks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	description: text('description'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const bookmarksToHistories = sqliteTable('bookmarks_to_histories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	bookmarkId: integer('bookmark_id')
		.notNull()
		.references(() => bookmarks.id, { onDelete: 'cascade' }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const bookmarksToHistoriesRelations = relations(
	bookmarksToHistories,
	({ one }) => ({
		bookmark: one(bookmarks, {
			fields: [bookmarksToHistories.bookmarkId],
			references: [bookmarks.id],
		}),
		history: one(histories, {
			fields: [bookmarksToHistories.historyId],
			references: [histories.id],
		}),
	})
);

export const bookmarksRelations = relations(bookmarks, ({ one, many }) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id],
	}),
	histories: many(bookmarksToHistories),
}));
