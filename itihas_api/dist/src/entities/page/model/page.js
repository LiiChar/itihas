"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layouts = exports.commentsToCommentsPageRelations = exports.pageCommentsToPageComments = exports.pageCommentsRelations = exports.pageComments = exports.pagePointsRelations = exports.pagePoints = exports.variablesRelations = exports.variables = exports.likePagesRelations = exports.likePages = exports.tagsToPagesRelations = exports.tagsToPages = exports.tags = exports.wallpapers = exports.pagesRelations = exports.pages = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const user_1 = require("../../user/user");
const history_1 = require("../../history/model/history");
exports.pages = (0, sqlite_core_1.sqliteTable)('pages', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => history_1.histories.id, { onDelete: 'cascade' }),
    layoutId: (0, sqlite_core_1.integer)('layout_id').references(() => exports.layouts.id),
    image: (0, sqlite_core_1.text)('photo').notNull().default('/public/assets/guest.png'),
    sound: (0, sqlite_core_1.text)('sound'),
    script: (0, sqlite_core_1.text)('script'),
    wallpaperId: (0, sqlite_core_1.integer)('wallpaper_id').references(() => exports.wallpapers.id),
    views: (0, sqlite_core_1.integer)('views').notNull().default(0),
    type: (0, sqlite_core_1.text)('type', { enum: ['start', 'end', 'default'] }).default('default'),
    description: (0, sqlite_core_1.text)('description'),
    mountAction: (0, sqlite_core_1.text)('mount_action'),
    unmountAction: (0, sqlite_core_1.text)('unmount_action'),
    content: (0, sqlite_core_1.text)('content').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.pagesRelations = (0, drizzle_orm_1.relations)(exports.pages, ({ many, one }) => ({
    layout: one(exports.layouts, {
        fields: [exports.pages.layoutId],
        references: [exports.layouts.id],
    }),
    wallpaper: one(exports.wallpapers, {
        fields: [exports.pages.wallpaperId],
        references: [exports.wallpapers.id],
    }),
    points: many(exports.pagePoints),
    history: one(history_1.histories, {
        fields: [exports.pages.historyId],
        references: [history_1.histories.id],
    }),
    tags: many(exports.tagsToPages),
}));
exports.wallpapers = (0, sqlite_core_1.sqliteTable)('wallpapers', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    alt: (0, sqlite_core_1.text)('alt'),
    rate: (0, sqlite_core_1.integer)('rate').notNull().default(0),
    source: (0, sqlite_core_1.text)('source').notNull(),
    width: (0, sqlite_core_1.integer)('width'),
    height: (0, sqlite_core_1.integer)('height'),
    description: (0, sqlite_core_1.text)('description'),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.tags = (0, sqlite_core_1.sqliteTable)('tags', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.tagsToPages = (0, sqlite_core_1.sqliteTable)('tags_pages', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    pageId: (0, sqlite_core_1.integer)('page_id')
        .notNull()
        .references(() => exports.pages.id, { onDelete: 'cascade' }),
    tagId: (0, sqlite_core_1.integer)('tag_id')
        .notNull()
        .references(() => exports.tags.id, { onDelete: 'cascade' }),
});
exports.tagsToPagesRelations = (0, drizzle_orm_1.relations)(exports.tagsToPages, ({ one }) => ({
    page: one(exports.pages, {
        fields: [exports.tagsToPages.pageId],
        references: [exports.pages.id],
    }),
    tag: one(exports.tags, {
        fields: [exports.tagsToPages.tagId],
        references: [exports.tags.id],
    }),
}));
exports.likePages = (0, sqlite_core_1.sqliteTable)('like_pages', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    pageId: (0, sqlite_core_1.integer)('page_id')
        .notNull()
        .references(() => exports.pages.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
});
exports.likePagesRelations = (0, drizzle_orm_1.relations)(exports.likePages, ({ one }) => ({
    user: one(user_1.users, {
        fields: [exports.likePages.userId],
        references: [user_1.users.id],
    }),
    page: one(exports.pages, {
        fields: [exports.likePages.pageId],
        references: [exports.pages.id],
    }),
}));
exports.variables = (0, sqlite_core_1.sqliteTable)('variables', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => history_1.histories.id, { onDelete: 'cascade' }),
    variable: (0, sqlite_core_1.text)('variable').notNull(),
    data: (0, sqlite_core_1.text)('data').notNull(),
    type: (0, sqlite_core_1.text)('type', {
        enum: ['string', 'number', 'array', 'object'],
    }).notNull(),
});
exports.variablesRelations = (0, drizzle_orm_1.relations)(exports.variables, ({ one }) => ({
    user: one(user_1.users, {
        fields: [exports.variables.userId],
        references: [user_1.users.id],
    }),
    history: one(history_1.histories, {
        fields: [exports.variables.historyId],
        references: [history_1.histories.id],
    }),
}));
exports.pagePoints = (0, sqlite_core_1.sqliteTable)('page_points', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    pageId: (0, sqlite_core_1.integer)('page_id')
        .notNull()
        .references(() => exports.pages.id, { onDelete: 'cascade' }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    action: (0, sqlite_core_1.text)('action').notNull(),
});
exports.pagePointsRelations = (0, drizzle_orm_1.relations)(exports.pagePoints, ({ one }) => ({
    page: one(exports.pages, {
        fields: [exports.pagePoints.pageId],
        references: [exports.pages.id],
    }),
}));
exports.pageComments = (0, sqlite_core_1.sqliteTable)('page_comments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    pageId: (0, sqlite_core_1.integer)('page_id')
        .notNull()
        .references(() => exports.pages.id, { onDelete: 'cascade' }),
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
exports.pageCommentsRelations = (0, drizzle_orm_1.relations)(exports.pageComments, ({ one, many }) => ({
    history: one(history_1.histories, {
        fields: [exports.pageComments.pageId],
        references: [history_1.histories.id],
    }),
    user: one(user_1.users, {
        fields: [exports.pageComments.userId],
        references: [user_1.users.id],
    }),
    comments: many(exports.pageCommentsToPageComments),
}));
exports.pageCommentsToPageComments = (0, sqlite_core_1.sqliteTable)('page_comments_to_comments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    pageCommentId: (0, sqlite_core_1.integer)('page_comment_id')
        .notNull()
        .references(() => history_1.histories.id, { onDelete: 'cascade' }),
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
exports.commentsToCommentsPageRelations = (0, drizzle_orm_1.relations)(exports.pageCommentsToPageComments, ({ one }) => ({
    comment: one(exports.pageComments, {
        fields: [exports.pageCommentsToPageComments.pageCommentId],
        references: [exports.pageComments.id],
    }),
    user: one(user_1.users, {
        fields: [exports.pageCommentsToPageComments.userId],
        references: [user_1.users.id],
    }),
}));
exports.layouts = (0, sqlite_core_1.sqliteTable)('layouts', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    layout: (0, sqlite_core_1.text)('layout', { mode: 'json' }).$type().notNull(),
    rate: (0, sqlite_core_1.integer)('rate').notNull().default(0),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
