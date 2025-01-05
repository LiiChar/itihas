import { useEffect } from 'react';
import { socket } from '../lib/websocket/websocket';
import { useUserStore } from '../store/UserStore';
import { toast } from 'sonner';

export type NotificationEventType = 'update' | 'add' | 'remove' | 'reply';
export type NotificationEventTarget = 'user' | 'history' | 'comment' | 'page';
export type NotificationEvent =
	`${NotificationEventTarget}:${NotificationEventType}`;

export type NotificationResponse = {
	id: number;
	description: string | null;
	createdAt: string;
	event: string;
	message: string;
} & {
	event: NotificationEvent;
	notificationData: NotificationData;
};

export type NotificationData = { userId: number } & { id: number } & Record<
		string,
		any
	>;

export const useNotification = () => {
	const { user } = useUserStore();
	useEffect(() => {
		if (!user) return;
		if (!user.id) return;

		socket.emit(`notification_subscribe`, { userId: user.id });

		socket.on('event', (data: NotificationResponse) => {
			toast(data.message, { description: data.description });
		});
		return () => {
			socket.emit(`notification_unscribe`, { userId: user.id });
		};
	}, []);
};
