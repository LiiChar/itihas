import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import {
	comments,
	commentsToComments,
	histories,
} from '../../history/model/history';
import {
	likePages,
	pageComments,
	pageCommentsToPageComments,
	userHistoryProgreses,
} from '../../page/model/page';
import { bookmarks } from '../../bookmark/model/bookmark';
import {
	battleParticipants,
	characters,
	charactersToUsers,
} from '../../character/model/character';

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

export const dignityRelations = relations(dignity, ({ many }) => ({
	users: many(users),
}));

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
	progreses: many(userHistoryProgreses),
	authorCharacters: many(characters),
	teams: many(teamsToUsers),
	battleParticipants: many(battleParticipants),
}));

export const teams = sqliteTable('teams', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	image: text('image'),
	description: text('description').notNull(),
	rating: integer('rating').default(0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const teamsToUsers = sqliteTable('teams_to_users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	teamsId: integer('teams_id')
		.notNull()
		.references(() => teams.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	created_at: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const optionsUsers = sqliteTable('options_users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	options: text('options').notNull().default(''),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updated_at: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const teamsToUsersRelations = relations(teamsToUsers, ({ one }) => ({
	user: one(users, {
		fields: [teamsToUsers.userId],
		references: [users.id],
	}),
	team: one(teams, {
		fields: [teamsToUsers.teamsId],
		references: [teams.id],
	}),
}));
export const teamsToHistories = sqliteTable('teams_to_histories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	teamsId: integer('teams_id')
		.notNull()
		.references(() => teams.id, { onDelete: 'cascade' }),
	created_at: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const teamsToHistoriesRelations = relations(
	teamsToHistories,
	({ one }) => ({
		histories: one(histories, {
			fields: [teamsToHistories.historyId],
			references: [histories.id],
		}),
		team: one(teams, {
			fields: [teamsToHistories.teamsId],
			references: [teams.id],
		}),
	})
);

export const teamsToUsersRelation = relations(teams, ({ many, one }) => ({
	users: many(users),
	histories: many(histories),
}));
