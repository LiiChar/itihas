import { relations, sql } from 'drizzle-orm';
import { users } from '../../user/model/user';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const notificationEvents = sqliteTable('notification_events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	event: text('event').unique().notNull(),
	message: text('message').notNull(),
	description: text('description'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const notificationEventsToUsers = sqliteTable(
	'notification_events_to_users',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		notificationId: integer('notification_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		data: text('data', { mode: 'json' }),
		isRead: text('is_read', { mode: 'json' }).notNull().default('false'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	}
);

export const notificationUsersRelations = relations(
	notificationEventsToUsers,
	({ one }) => ({
		user: one(users, {
			fields: [notificationEventsToUsers.userId],
			references: [users.id],
		}),
		notification: one(notificationEvents, {
			fields: [notificationEventsToUsers.notificationId],
			references: [notificationEvents.id],
		}),
	})
);
