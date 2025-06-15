import { sql, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { histories } from '../../history/model/history';
import { users } from '../../user/model/user';

export const characters = sqliteTable('characters', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
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
	}).default('handmade'),
	rank: integer('rank').notNull().default(0),
	attack: integer('attack').default(10),
	armor: integer('armor').default(10),
	health: integer('health').default(100),
	image: text('image'),
	description: text('description'),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	authorId: integer('author_id').references(() => users.id, {
		onDelete: 'set null',
	}),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const charactersToUsers = sqliteTable('characters_to_users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	characterId: integer('character_id')
		.notNull()
		.references(() => characters.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const charactersToUsersRelations = relations(
	charactersToUsers,
	({ one }) => ({
		character: one(characters, {
			fields: [charactersToUsers.characterId],
			references: [characters.id],
		}),
		user: one(users, {
			fields: [charactersToUsers.userId],
			references: [users.id],
		}),
	})
);

export const battles = sqliteTable('battles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	startedAt: text('started_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	status: text('status', {
		enum: ['started', 'finished', 'initialized'],
	}).default('initialized'),
	endedAt: text('ended_at'),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const battlesRelation = relations(battles, ({ many }) => ({
	participants: many(battleParticipants),
	results: many(battleResults),
}));

export const battleParticipants = sqliteTable('battle_participants', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	battleId: integer('battle_id')
		.notNull()
		.references(() => battles.id, { onDelete: 'cascade' }),
	characterId: integer('character_id')
		.notNull()
		.references(() => characters.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	team: text('team'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const battleParticipantsRelations = relations(
	battleParticipants,
	({ one }) => ({
		battle: one(battles, {
			fields: [battleParticipants.battleId],
			references: [battles.id],
		}),
		character: one(characters, {
			fields: [battleParticipants.characterId],
			references: [characters.id],
		}),
		user: one(users, {
			fields: [battleParticipants.userId],
			references: [users.id],
		}),
	})
);

export const battleResults = sqliteTable('battle_results', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	battleId: integer('battle_id')
		.notNull()
		.references(() => battles.id, { onDelete: 'cascade' }),
	log: text('log', { mode: 'json' }),
	result: text('result', { mode: 'json' }),
	status: text('status', {
		enum: ['complate', 'reject', 'draw', 'failed'],
	}).notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const battleResultsRelations = relations(battleResults, ({ one }) => ({
	battle: one(battles, {
		fields: [battleResults.battleId],
		references: [battles.id],
	}),
}));

export const charactersRelation = relations(characters, ({ one, many }) => ({
	history: one(histories, {
		fields: [characters.historyId],
		references: [histories.id],
	}),
	users: many(charactersToUsers),
	user: one(users, {
		fields: [characters.authorId],
		references: [users.id],
	}),
	battleParticipants: many(battleParticipants),
}));
