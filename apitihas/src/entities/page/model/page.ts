import { relations, sql } from 'drizzle-orm';
import {
	sqliteTable,
	text,
	integer,
	primaryKey,
} from 'drizzle-orm/sqlite-core';
import { users } from '../../user/model/user';
import { histories } from '../../history/model/history';
import { LayoutComponent, layoutComponents } from '../type/layout';

export const pages = sqliteTable('pages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	layoutId: integer('layout_id').references(() => layouts.id, {
		onDelete: 'set null',
	}),
	image: text('photo').notNull().default('/public/assets/guest.png'),
	sound: text('sound'),
	script: text('script'),
	wallpaper: text('wallpaper'),
	wrapperStyle: text('wrapper_style'),

	views: integer('views').notNull().default(0),
	type: text('type', { enum: ['start', 'end', 'default'] }).default('default'),
	description: text('description'),
	keypage: integer('keypage').default(1),
	mountAction: text('mount_action'),
	unmountAction: text('unmount_action'),
	content: text('content').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const pagesRelations = relations(pages, ({ many, one }) => ({
	layout: one(layouts, {
		fields: [pages.layoutId],
		references: [layouts.id],
	}),
	points: many(pagePoints),
	history: one(histories, {
		fields: [pages.historyId],
		references: [histories.id],
	}),
	progreses: many(userHistoryProgreses),
	tags: many(tagsToPages),
}));

export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const tagsToPages = sqliteTable('tags_pages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pageId: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade' }),
	tagId: integer('tag_id')
		.notNull()
		.references(() => tags.id, { onDelete: 'cascade' }),
});

export const tagsToPagesRelations = relations(tagsToPages, ({ one }) => ({
	page: one(pages, {
		fields: [tagsToPages.pageId],
		references: [pages.id],
	}),
	tag: one(tags, {
		fields: [tagsToPages.tagId],
		references: [tags.id],
	}),
}));

export const likePages = sqliteTable('like_pages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pageId: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const likePagesRelations = relations(likePages, ({ one }) => ({
	user: one(users, {
		fields: [likePages.userId],
		references: [users.id],
	}),
	page: one(pages, {
		fields: [likePages.pageId],
		references: [pages.id],
	}),
}));

export const variables = sqliteTable('variables', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	variable: text('variable').notNull(),
	data: text('data').notNull(),
	type: text('type', {
		enum: ['string', 'number', 'array', 'object'],
	}).notNull(),
});

export const variablesRelations = relations(variables, ({ one }) => ({
	user: one(users, {
		fields: [variables.userId],
		references: [users.id],
	}),
	history: one(histories, {
		fields: [variables.historyId],
		references: [histories.id],
	}),
}));

export const pagePoints = sqliteTable('page_points', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pageId: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	action: text('action').notNull(),
});

export const pagePointsRelations = relations(pagePoints, ({ one }) => ({
	page: one(pages, {
		fields: [pagePoints.pageId],
		references: [pages.id],
	}),
}));

export const pageComments = sqliteTable('page_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pageId: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	rate: integer('rate').notNull().default(0),
	content: text('content').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const pageCommentsRelations = relations(
	pageComments,
	({ one, many }) => ({
		history: one(histories, {
			fields: [pageComments.pageId],
			references: [histories.id],
		}),
		user: one(users, {
			fields: [pageComments.userId],
			references: [users.id],
		}),
		comments: many(pageCommentsToPageComments),
	})
);

export const pageCommentsToPageComments = sqliteTable(
	'page_comments_to_comments',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		pageCommentId: integer('page_comment_id')
			.notNull()
			.references(() => histories.id, { onDelete: 'cascade' }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		rate: integer('rate').notNull().default(0),
		content: text('content').notNull(),
		createdAt: text('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	}
);

export const commentsToCommentsPageRelations = relations(
	pageCommentsToPageComments,
	({ one }) => ({
		comment: one(pageComments, {
			fields: [pageCommentsToPageComments.pageCommentId],
			references: [pageComments.id],
		}),
		user: one(users, {
			fields: [pageCommentsToPageComments.userId],
			references: [users.id],
		}),
	})
);

export const layouts = sqliteTable('layouts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	layout: text('layout', { mode: 'json' }).$type<LayoutComponent[]>().notNull(),
	rate: integer('rate').notNull().default(0),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const layoutsRelation = relations(layouts, ({ one }) => ({
	user: one(users, {
		fields: [layouts.userId],
		references: [users.id],
	}),
}));

export const userHistoryProgreses = sqliteTable('user_history_progreses', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	description: text('description'),
	prevPageId: integer('prev_page_id').references(() => pages.id, {
		onDelete: 'set null',
	}),
	nextPageId: integer('next_page_id').references(() => pages.id, {
		onDelete: 'set null',
	}),
	userId: integer('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	historyId: integer('history_id')
		.references(() => histories.id, { onDelete: 'cascade' })
		.notNull(),
	pageId: integer('page_id')
		.references(() => pages.id, { onDelete: 'cascade' })
		.notNull(),
	completedAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const userHistoryProgressRelations = relations(
	userHistoryProgreses,
	({ one }) => ({
		user: one(users, {
			fields: [userHistoryProgreses.userId],
			references: [users.id],
		}),
		history: one(histories, {
			fields: [userHistoryProgreses.historyId],
			references: [histories.id],
		}),
		page: one(pages, {
			fields: [userHistoryProgreses.pageId],
			references: [pages.id],
		}),
		nextPage: one(pages, {
			fields: [userHistoryProgreses.nextPageId],
			references: [pages.id],
		}),
		prevPage: one(pages, {
			fields: [userHistoryProgreses.prevPageId],
			references: [pages.id],
		}),
	})
);
