import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { notificationEventsToUsers } from '../../database/scheme';
import { socket } from '../..';
import { SocketClient } from '../websocket';

export const handlerNotificationRead = async ({
	notificationId,
}: {
	notificationId: number;
}) => {
	console.log(notificationId);

	await db
		.update(notificationEventsToUsers)
		.set({ isRead: true })
		.where(eq(notificationEventsToUsers.id, notificationId))
		.returning();
};

export const handlerNotificationUnsribe = async ({
	data,
	socket,
	socketClients,
}: {
	data: { userId: number };
	socket: SocketClient;
	socketClients: Record<number, SocketClient>;
}) => {
	if (!data.userId) {
		return;
	}
	delete socketClients[data.userId];
	socket.leave(`notification:${data.userId}`);
};

export const handlerNotificationSubscribe = async ({
	data,
	socket,
	socketClients,
}: {
	data: { userId: number };
	socket: SocketClient;
	socketClients: Record<number, SocketClient>;
}) => {
	if (!data.userId) {
		return;
	}
	socketClients[data.userId] = socket;
	socket.join(`notification:${data.userId}`);
};
