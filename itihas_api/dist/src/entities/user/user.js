"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.users = exports.dignityRelations = exports.dignity = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const history_1 = require("../history/model/history");
exports.dignity = (0, sqlite_core_1.sqliteTable)('dignity', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
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
    })
        .notNull()
        .default('common'),
    name: (0, sqlite_core_1.text)('name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.dignityRelations = (0, drizzle_orm_1.relations)(exports.dignity, ({ many }) => ({
    users: many(exports.users),
}));
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull().unique(),
    password: (0, sqlite_core_1.text)('password').notNull(),
    photo: (0, sqlite_core_1.text)('photo').notNull().default('/assets/guest.png'),
    verify: (0, sqlite_core_1.integer)('verify', { mode: 'boolean' }).notNull().default(false),
    location: (0, sqlite_core_1.text)('location'),
    dignityId: (0, sqlite_core_1.integer)('dignity').references(() => exports.dignity.id, {
        onDelete: 'set null',
    }),
    description: (0, sqlite_core_1.text)('about'),
    age: (0, sqlite_core_1.integer)('age'),
    role: (0, sqlite_core_1.text)('role', { enum: ['user', 'admin'] })
        .notNull()
        .default('user'),
    email: (0, sqlite_core_1.text)('email'),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many, one }) => ({
    authorHistories: many(history_1.histories),
    dignity: one(exports.dignity, {
        fields: [exports.users.dignityId],
        references: [exports.dignity.id],
    }),
}));
