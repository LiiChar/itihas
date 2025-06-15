export type Notification = {
	id: number;
	description: string | null;
	createdAt: string;
	event: string;
	message: string;
};

export type NotificationUser = {
	data: Record<string, any>;
	id: number;
	createdAt: string;
	userId: number;
	notificationId: number;
	isRead: unknown;
};

export type NotificationUserResponse = NotificationUser & {
	notification: Notification;
};
