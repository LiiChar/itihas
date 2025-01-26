import { create } from 'zustand';
import { NotificationUserResponse } from '../type/notification';

export type NotificationProperty = {
	notification: NotificationUserResponse[];
};

type NotificationHandler = {
	addNotification: (noty: NotificationUserResponse) => void;
	setNotification: (noties: NotificationUserResponse[]) => void;
	removeNotification: (notyId: number) => void;
};

export type NotificationStore = NotificationProperty & NotificationHandler;

export const useNotificationStore = create<NotificationStore>(set => ({
	notification: [],
	addNotification(noty) {
		set(store => ({ notification: [...store.notification, noty] }));
	},
	removeNotification(notyId) {
		set(store => ({
			notification: store.notification.filter(v => v.id !== notyId),
		}));
	},
	setNotification(noties) {
		set(() => ({ notification: noties }));
	},
}));
