"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationUsersRelations = exports.notificationEventsToUsers = exports.notificationEvents = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = require("../../user/model/user");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.notificationEvents = (0, sqlite_core_1.sqliteTable)('notification_events', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    event: (0, sqlite_core_1.text)('event').unique().notNull(),
    message: (0, sqlite_core_1.text)('message').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.notificationEventsToUsers = (0, sqlite_core_1.sqliteTable)('notification_events_to_users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    notificationId: (0, sqlite_core_1.integer)('notification_id')
        .notNull()
        .references(() => user_1.users.id, { onDelete: 'cascade' }),
    data: (0, sqlite_core_1.text)('data', { mode: 'json' }),
    isRead: (0, sqlite_core_1.text)('is_read', { mode: 'json' }).notNull().default('false'),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.notificationUsersRelations = (0, drizzle_orm_1.relations)(exports.notificationEventsToUsers, ({ one }) => ({
    user: one(user_1.users, {
        fields: [exports.notificationEventsToUsers.userId],
        references: [user_1.users.id],
    }),
    notification: one(exports.notificationEvents, {
        fields: [exports.notificationEventsToUsers.notificationId],
        references: [exports.notificationEvents.id],
    }),
}));
