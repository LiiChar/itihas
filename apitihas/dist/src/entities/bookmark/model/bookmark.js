"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarksRelations = exports.bookmarks = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = require("../../user/model/user");
const history_1 = require("../../history/model/history");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.bookmarks = (0, sqlite_core_1.sqliteTable)('bookmarks', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    description: (0, sqlite_core_1.text)('description'),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.bookmarksRelations = (0, drizzle_orm_1.relations)(exports.bookmarks, ({ one, many }) => ({
    user: one(user_1.users, {
        fields: [exports.bookmarks.userId],
        references: [user_1.users.id],
    }),
    histories: many(history_1.bookmarksToHistories),
}));
