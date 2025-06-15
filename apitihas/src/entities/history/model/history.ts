import { relations, sql } from 'drizzle-orm';
import {
	sqliteTable,
	text,
	integer,
	primaryKey,
} from 'drizzle-orm/sqlite-core';
import { teamsToHistories, users } from '../../user/model/user';
import {
	layouts,
	pageCommentsToPageComments,
	pages,
	userHistoryProgreses,
} from '../../page/model/page';
import { bookmarks } from '../../bookmark/model/bookmark';
import { characters } from '../../character/model/character';

export const histories = sqliteTable('histories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	image: text('image').notNull().default('/public/assets/guest.png'),
	description: text('description'),
	globalAction: text('global_action'),
	authorId: integer('author_id').references(() => users.id, {
		onDelete: 'set null',
	}),
	status: text('status', {
		enum: ['complete', 'write', 'frozen', 'announcement'],
	})
		.notNull()
		.default('announcement'),
	type: text('type', { enum: ['free', 'paid'] })
		.notNull()
		.default('free'),
	layoutId: integer('layout_id')
		.notNull()
		.references(() => layouts.id, { onDelete: 'cascade' })
		.default(1),
	wallpaper: text('wallpaper'),
	sound: text('sound').default('/public/assets/default.mp3'),
	minAge: integer('min_age'),
	rate: integer('rate').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const historiesRelations = relations(histories, ({ many, one }) => ({
	layout: one(layouts, {
		fields: [histories.layoutId],
		references: [layouts.id],
	}),
	characters: many(characters),
	points: many(historyPoints),
	pages: many(pages),
	comments: many(comments),
	similarHistories: many(similarHistories, { relationName: 'similar' }),
	genres: many(genresToHistories),
	teams: many(teamsToHistories),
	progreses: many(userHistoryProgreses),
	bookmarks: many(bookmarksToHistories),
	author: one(users, {
		fields: [histories.authorId],
		references: [users.id],
	}),
	likes: many(likesToHistories),
}));

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

export const similarHistories = sqliteTable('similar_histories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	similarHistoryId: integer('similar_history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	similar: integer('similar').notNull().default(1),
	created_at: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const similarHistoriesRelation = relations(
	similarHistories,
	({ one }) => ({
		history: one(histories, {
			fields: [similarHistories.historyId],
			references: [histories.id],
			relationName: 'history',
		}),
		similarHistory: one(histories, {
			fields: [similarHistories.similarHistoryId],
			references: [histories.id],
			relationName: 'similar',
		}),
	})
);

export const historyPoints = sqliteTable('history_points', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	action: text('action').notNull(),
});

export const historyPointsRelations = relations(historyPoints, ({ one }) => ({
	history: one(histories, {
		fields: [historyPoints.historyId],
		references: [histories.id],
	}),
}));

export const comments = sqliteTable('comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
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
});

export const likeToComments = sqliteTable('like_to_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	commentId: integer('comment_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	variant: text('variant', { enum: ['negative', 'positive'] }),

	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const likeToCommentsRelations = relations(
	likeToComments,
	({ one, many }) => ({
		comment: one(comments, {
			fields: [likeToComments.commentId],
			references: [comments.id],
		}),
		user: one(users, {
			fields: [likeToComments.userId],
			references: [users.id],
		}),
	})
);

export const likeToCommentComments = sqliteTable('like_to_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	commentsCommentId: integer('comments_comment_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	variant: text('variant', { enum: ['negative', 'positive'] }),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const likeToCommentsCommentRelations = relations(
	likeToCommentComments,
	({ one, many }) => ({
		commentsComment: one(commentsToComments, {
			fields: [likeToCommentComments.commentsCommentId],
			references: [commentsToComments.id],
		}),
		user: one(users, {
			fields: [likeToCommentComments.userId],
			references: [users.id],
		}),
	})
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
	history: one(histories, {
		fields: [comments.historyId],
		references: [histories.id],
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	comments: many(commentsToComments),
	likes: many(likeToComments),
}));

export const commentsToComments = sqliteTable('comments_to_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	commentId: integer('comment_id')
		.notNull()
		.references(() => comments.id, { onDelete: 'cascade' }),
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

export const commentsToCommentsRelations = relations(
	commentsToComments,
	({ one, many }) => ({
		comment: one(comments, {
			fields: [commentsToComments.commentId],
			references: [comments.id],
		}),
		user: one(users, {
			fields: [commentsToComments.userId],
			references: [users.id],
		}),
		likes: many(likeToCommentComments),
	})
);

export const genres = sqliteTable('genres', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
});

export const genresRelations = relations(genres, ({ many }) => ({
	histories: many(histories),
	genresToHistories: many(genresToHistories),
}));

export const genresToHistories = sqliteTable('genres_to_histories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	genreId: integer('genre_id')
		.notNull()
		.references(() => genres.id, { onDelete: 'cascade' }),
	created_at: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const genresToHistoriesRelations = relations(
	genresToHistories,
	({ one }) => ({
		history: one(histories, {
			fields: [genresToHistories.historyId],
			references: [histories.id],
		}),
		genre: one(genres, {
			fields: [genresToHistories.genreId],
			references: [genres.id],
		}),
	})
);

export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
});

export const tagsToHistories = sqliteTable('tags_to_histories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	genreId: integer('genre_id')
		.notNull()
		.references(() => tags.id, { onDelete: 'cascade' }),
	created_at: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const tagsToHistoriesRelations = relations(
	tagsToHistories,
	({ one }) => ({
		history: one(histories, {
			fields: [tagsToHistories.historyId],
			references: [histories.id],
		}),
		genre: one(tags, {
			fields: [tagsToHistories.genreId],
			references: [tags.id],
		}),
	})
);

export const likesToHistories = sqliteTable('like_to_history', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	historyId: integer('history_id')
		.notNull()
		.references(() => histories.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	value: integer('variant'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const likesToHistoriesRelations = relations(
	likesToHistories,
	({ one }) => ({
		history: one(histories, {
			fields: [likesToHistories.historyId],
			references: [histories.id],
		}),
		genre: one(users, {
			fields: [likesToHistories.userId],
			references: [users.id],
		}),
	})
);
