"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamsToUsersRelation = exports.teamsToHistoriesRelations = exports.teamsToHistories = exports.teamsToUsersRelations = exports.optionsUsers = exports.teamsToUsers = exports.teams = exports.usersRelations = exports.users = exports.dignityRelations = exports.dignity = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const history_1 = require("../../history/model/history");
const page_1 = require("../../page/model/page");
const bookmark_1 = require("../../bookmark/model/bookmark");
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
    comments: many(history_1.comments),
    commentsPage: many(page_1.pageComments),
    commentsReply: many(history_1.commentsToComments),
    bookmarks: many(bookmark_1.bookmarks),
    characters: many(history_1.charactersToUsers),
    likes: many(page_1.likePages),
    progreses: many(page_1.userHistoryProgreses),
}));
exports.teams = (0, sqlite_core_1.sqliteTable)('teams', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name'),
    image: (0, sqlite_core_1.text)('image'),
    description: (0, sqlite_core_1.text)('description').notNull(),
    rating: (0, sqlite_core_1.integer)('rating').default(0),
    createdAt: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.teamsToUsers = (0, sqlite_core_1.sqliteTable)('teams_to_users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    teamsId: (0, sqlite_core_1.integer)('teams_id')
        .notNull()
        .references(() => exports.teams.id, { onDelete: 'cascade' }),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    created_at: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.optionsUsers = (0, sqlite_core_1.sqliteTable)('options_users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    options: (0, sqlite_core_1.text)('options').notNull().default(''),
    userId: (0, sqlite_core_1.integer)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    updated_at: (0, sqlite_core_1.text)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.teamsToUsersRelations = (0, drizzle_orm_1.relations)(exports.teamsToUsers, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.teamsToUsers.userId],
        references: [exports.users.id],
    }),
    team: one(exports.teams, {
        fields: [exports.teamsToUsers.teamsId],
        references: [exports.teams.id],
    }),
}));
exports.teamsToHistories = (0, sqlite_core_1.sqliteTable)('teams_to_histories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    historyId: (0, sqlite_core_1.integer)('history_id')
        .notNull()
        .references(() => history_1.histories.id, { onDelete: 'cascade' }),
    teamsId: (0, sqlite_core_1.integer)('teams_id')
        .notNull()
        .references(() => exports.teams.id, { onDelete: 'cascade' }),
    created_at: (0, sqlite_core_1.text)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.teamsToHistoriesRelations = (0, drizzle_orm_1.relations)(exports.teamsToHistories, ({ one }) => ({
    histories: one(history_1.histories, {
        fields: [exports.teamsToHistories.historyId],
        references: [history_1.histories.id],
    }),
    team: one(exports.teams, {
        fields: [exports.teamsToHistories.teamsId],
        references: [exports.teams.id],
    }),
}));
exports.teamsToUsersRelation = (0, drizzle_orm_1.relations)(exports.teams, ({ many, one }) => ({
    users: many(exports.users),
    histories: many(history_1.histories),
}));
//# sourceMappingURL=user.js.map