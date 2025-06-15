import { relations, sql } from 'drizzle-orm';
import { users } from '../../user/model/user';
import { bookmarksToHistories, histories } from '../../history/model/history';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bookmarks = sqliteTable('bookmarks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	description: text('description'),
	color: text('color'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const bookmarksRelations = relations(bookmarks, ({ one, many }) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id],
	}),
	histories: many(bookmarksToHistories),
}));
