import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import {
	bookmarks,
	bookmarksToHistories,
	charactersToUsers,
	comments,
	commentsToComments,
	histories,
} from '../../history/model/history';
import { likePages, pageComments } from '../../page/model/page';

export const dignity = sqliteTable('dignity', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	rarity: text('rarity', {
		enum: [
			'handmade',
			'common',
			'uncommon',
			'rare',
			'epic',
			'legendary',
			'mythic',
			'transcendent',
		],
	})
		.notNull()
		.default('common'),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const dignityRelations = relations(dignity, ({ many }) => ({
	users: many(users),
}));

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	password: text('password').notNull(),
	photo: text('photo').notNull().default('/assets/guest.png'),
	verify: integer('verify', { mode: 'boolean' }).notNull().default(false),
	location: text('location'),
	dignityId: integer('dignity').references(() => dignity.id, {
		onDelete: 'set null',
	}),
	description: text('about'),
	age: integer('age'),
	role: text('role', { enum: ['user', 'admin'] })
		.notNull()
		.default('user'),
	email: text('email'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many, one }) => ({
	authorHistories: many(histories),
	dignity: one(dignity, {
		fields: [users.dignityId],
		references: [dignity.id],
	}),
	comments: many(comments),
	commentsPage: many(pageComments),
	commentsReply: many(commentsToComments),
	bookmarks: many(bookmarks),
	characters: many(charactersToUsers),
	likes: many(likePages),
}));
