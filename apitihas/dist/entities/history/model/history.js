"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesToHistoriesRelations = exports.likesToHistories = exports.tagsToHistoriesRelations = exports.tagsToHistories = exports.tags = exports.genresToHistoriesRelations = exports.genresToHistories = exports.genresRelations = exports.genres = exports.commentsToCommentsRelations = exports.commentsToComments = exports.commentsRelations = exports.likeToCommentsCommentRelations = exports.likeToCommentComments = exports.likeToCommentsRelations = exports.likeToComments = exports.comments = exports.historyPointsRelations = exports.historyPoints = exports.similarHistoriesRelation = exports.similarHistories = exports.charactersToUsersRelations = exports.charactersToUsers = exports.charactersRelation = exports.characters = exports.bookmarksToHistoriesRelations = exports.bookmarksToHistories = exports.historiesRelations = exports.histories = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const user_1 = require("../../user/model/user");
const page_1 = require("../../page/model/page");
const bookmark_1 = require("../../bookmark/model/bookmark");
exports.histories = (0, sqlite_core_1.sqliteTable)('histories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull().unique(),
    image: (0, sqlite_core_1.text)('image').notNull().default('/public/assets/guest.png'),
    description: (0, sqlite_core_1.text)('description'),
    globalAction: (0, sqlite_core_1.text)('global_action'),
    authorId: (0, sqlite_core_1.integer)('author_id').references(() => user_1.users.id, {
        onDelete: 'set null',
    }),
    status: (0, sqlite_core_1.text)('status', {
        enum: ['complete', 'write', 'frozen', 'announcement'],
    })
        .notNull()
        .default('announcement'),
    type: (0, sqlite_core_1.text)('type', { enum: ['free', 'paid'] })
        .notNull()
        .default('free'),
    layoutId: (0, sqlite_core_1.integer)('layout_id')
        .notNull()
        .references(() => page_1.layouts.id, { onDelete: 'cascade' })
        .default(1),
    wallpaper: (0, sqlite_core_1.text)('wallpaper'),
    sound: (0, sqlite_core_1.text)('sound').default('/public/assets/default.mp3'),
    minAge: (0, sqlite_core_1.integer)('min_age'),
    rate: (0, sqlite_core_1.integer)('rate').notNull().default(0),
    created_at: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updated_at: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.historiesRelations = (0, drizzle_orm_1.relations)(exports.histories, ({ many, one }) => ({
    layout: one(page_1.layouts, {
        fields: [exports.histories.layoutId],
        references: [page_1.layouts.id],
    }),
    characters: many(exports.characters),
    points: many(exports.historyPoints),
    pages: many(page_1.pages),
    comments: many(exports.comments),
    similarHistories: many(exports.similarHistories, { relationName: 'similar' }),
    genres: many(exports.genresToHistories),
    progreses: many(page_1.userHistoryProgreses),
    bookmarks: many(exports.bookmarksToHistories),
    author: one(user_1.users, {
        fields: [exports.histories.authorId],
        references: [user_1.users.id],
    }),
    likes: many(exports.likesToHistories),
}));
exports.bookmarksToHistories = (0, sqlite_core_1.sqliteTable)('bookmarks_to_histories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    bookmarkId: (0, sqlite_core_1.integer)('bookmark_id')
        .notNull()
        .references(() => bookmark_1.bookmarks.id, { onDelete: 'cascade' }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.bookmarksToHistoriesRelations = (0, drizzle_orm_1.relations)(exports.bookmarksToHistories, ({ one }) => ({
    bookmark: one(bookmark_1.bookmarks, {
        fields: [exports.bookmarksToHistories.bookmarkId],
        references: [bookmark_1.bookmarks.id],
    }),
    history: one(exports.histories, {
        fields: [exports.bookmarksToHistories.historyId],
        references: [exports.histories.id],
    }),
}));
exports.characters = (0, sqlite_core_1.sqliteTable)('characters', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    rarity: (0, sqlite_core_1.text)('rarity', {
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
    rank: (0, sqlite_core_1.integer)('rank').notNull().default(0),
    image: (0, sqlite_core_1.text)('image'),
    description: (0, sqlite_core_1.text)('description'),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.charactersRelation = (0, drizzle_orm_1.relations)(exports.characters, ({ one }) => ({
    history: one(exports.histories, {
        fields: [exports.characters.historyId],
        references: [exports.histories.id],
    }),
}));
exports.charactersToUsers = (0, sqlite_core_1.sqliteTable)('characters_to_users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    characterId: (0, sqlite_core_1.integer)('character_id')
        .notNull()
        .references(() => exports.characters.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
});
exports.charactersToUsersRelations = (0, drizzle_orm_1.relations)(exports.charactersToUsers, ({ one }) => ({
    character: one(exports.characters, {
        fields: [exports.charactersToUsers.characterId],
        references: [exports.characters.id],
    }),
    user: one(user_1.users, {
        fields: [exports.charactersToUsers.userId],
        references: [user_1.users.id],
    }),
}));
exports.similarHistories = (0, sqlite_core_1.sqliteTable)('similar_histories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    similarHistoryId: (0, sqlite_core_1.integer)('similar_history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    similar: (0, sqlite_core_1.integer)('similar').notNull().default(1),
    created_at: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.similarHistoriesRelation = (0, drizzle_orm_1.relations)(exports.similarHistories, ({ one }) => ({
    history: one(exports.histories, {
        fields: [exports.similarHistories.historyId],
        references: [exports.histories.id],
        relationName: 'history',
    }),
    similarHistory: one(exports.histories, {
        fields: [exports.similarHistories.similarHistoryId],
        references: [exports.histories.id],
        relationName: 'similar',
    }),
}));
exports.historyPoints = (0, sqlite_core_1.sqliteTable)('history_points', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    action: (0, sqlite_core_1.text)('action').notNull(),
});
exports.historyPointsRelations = (0, drizzle_orm_1.relations)(exports.historyPoints, ({ one }) => ({
    history: one(exports.histories, {
        fields: [exports.historyPoints.historyId],
        references: [exports.histories.id],
    }),
}));
exports.comments = (0, sqlite_core_1.sqliteTable)('comments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    rate: (0, sqlite_core_1.integer)('rate').notNull().default(0),
    content: (0, sqlite_core_1.text)('content').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.likeToComments = (0, sqlite_core_1.sqliteTable)('like_to_comments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    commentId: (0, sqlite_core_1.integer)('comment_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    variant: (0, sqlite_core_1.text)('variant', { enum: ['negative', 'positive'] }),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.likeToCommentsRelations = (0, drizzle_orm_1.relations)(exports.likeToComments, ({ one, many }) => ({
    comment: one(exports.comments, {
        fields: [exports.likeToComments.commentId],
        references: [exports.comments.id],
    }),
    user: one(user_1.users, {
        fields: [exports.likeToComments.userId],
        references: [user_1.users.id],
    }),
}));
exports.likeToCommentComments = (0, sqlite_core_1.sqliteTable)('like_to_comments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    commentsCommentId: (0, sqlite_core_1.integer)('comments_comment_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    variant: (0, sqlite_core_1.text)('variant', { enum: ['negative', 'positive'] }),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.likeToCommentsCommentRelations = (0, drizzle_orm_1.relations)(exports.likeToCommentComments, ({ one, many }) => ({
    commentsComment: one(exports.commentsToComments, {
        fields: [exports.likeToCommentComments.commentsCommentId],
        references: [exports.commentsToComments.id],
    }),
    user: one(user_1.users, {
        fields: [exports.likeToCommentComments.userId],
        references: [user_1.users.id],
    }),
}));
exports.commentsRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one, many }) => ({
    history: one(exports.histories, {
        fields: [exports.comments.historyId],
        references: [exports.histories.id],
    }),
    user: one(user_1.users, {
        fields: [exports.comments.userId],
        references: [user_1.users.id],
    }),
    comments: many(exports.commentsToComments),
    likes: many(exports.likeToComments),
}));
exports.commentsToComments = (0, sqlite_core_1.sqliteTable)('comments_to_comments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    commentId: (0, sqlite_core_1.integer)('comment_id')
        .notNull()
        .references(() => exports.comments.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    rate: (0, sqlite_core_1.integer)('rate').notNull().default(0),
    content: (0, sqlite_core_1.text)('content').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.commentsToCommentsRelations = (0, drizzle_orm_1.relations)(exports.commentsToComments, ({ one, many }) => ({
    comment: one(exports.comments, {
        fields: [exports.commentsToComments.commentId],
        references: [exports.comments.id],
    }),
    user: one(user_1.users, {
        fields: [exports.commentsToComments.userId],
        references: [user_1.users.id],
    }),
    likes: many(exports.likeToCommentComments),
}));
exports.genres = (0, sqlite_core_1.sqliteTable)('genres', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull().unique(),
});
exports.genresRelations = (0, drizzle_orm_1.relations)(exports.genres, ({ many }) => ({
    histories: many(exports.histories),
    genresToHistories: many(exports.genresToHistories),
}));
exports.genresToHistories = (0, sqlite_core_1.sqliteTable)('genres_to_histories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    genreId: (0, sqlite_core_1.integer)('genre_id')
        .notNull()
        .references(() => exports.genres.id, { onDelete: 'cascade' }),
    created_at: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.genresToHistoriesRelations = (0, drizzle_orm_1.relations)(exports.genresToHistories, ({ one }) => ({
    history: one(exports.histories, {
        fields: [exports.genresToHistories.historyId],
        references: [exports.histories.id],
    }),
    genre: one(exports.genres, {
        fields: [exports.genresToHistories.genreId],
        references: [exports.genres.id],
    }),
}));
exports.tags = (0, sqlite_core_1.sqliteTable)('tags', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull().unique(),
});
exports.tagsToHistories = (0, sqlite_core_1.sqliteTable)('tags_to_histories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    genreId: (0, sqlite_core_1.integer)('genre_id')
        .notNull()
        .references(() => exports.tags.id, { onDelete: 'cascade' }),
    created_at: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.tagsToHistoriesRelations = (0, drizzle_orm_1.relations)(exports.tagsToHistories, ({ one }) => ({
    history: one(exports.histories, {
        fields: [exports.tagsToHistories.historyId],
        references: [exports.histories.id],
    }),
    genre: one(exports.tags, {
        fields: [exports.tagsToHistories.genreId],
        references: [exports.tags.id],
    }),
}));
exports.likesToHistories = (0, sqlite_core_1.sqliteTable)('like_to_history', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => exports.histories.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    variant: (0, sqlite_core_1.text)('variant', { enum: ['negative', 'positive'] }),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.likesToHistoriesRelations = (0, drizzle_orm_1.relations)(exports.likesToHistories, ({ one }) => ({
    history: one(exports.histories, {
        fields: [exports.likesToHistories.historyId],
        references: [exports.histories.id],
    }),
    genre: one(user_1.users, {
        fields: [exports.likesToHistories.userId],
        references: [user_1.users.id],
    }),
}));
//# sourceMappingURL=history.js.map