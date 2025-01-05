export type Notification = {
	id: number;
	description: string | null;
	createdAt: string;
	event: string;
	message: string;
};

export type NotificationUser = {
	data: unknown;
	id: number;
	createdAt: string;
	userId: number;
	notificationId: number;
	isRead: unknown;
};

export type NotificationUserResponse = NotificationUser & {
	notification: Notification;
};
