import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { notificationEventsToUsers } from './model/notification';

export const getNotification = async (userId: number) => {
	const notification = await db.query.notificationEventsToUsers.findMany({
		where: eq(notificationEventsToUsers.userId, userId),
		with: {
			notification: true,
		},
	});

	return notification;
};
