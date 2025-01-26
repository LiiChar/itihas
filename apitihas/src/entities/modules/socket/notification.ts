import { eq } from 'drizzle-orm';
import { db } from '../../../database/db';
import { SocketClient } from '../../../websocket/websocket';
import {
	notificationEvents,
	notificationEventsToUsers,
} from '../../notification/model/notification';
import { ErrorBoundary } from '../../../lib/error';
import { ReasonPhrases } from 'http-status-codes';
import { socket } from '../../..';
import { bookmarksToHistories } from '../../history/model/history';
import { pages } from '../../page/model/page';

export type NotificationEventType = 'update' | 'add' | 'remove' | 'reply';
export type NotificationEventTarget = 'user' | 'history' | 'comment' | 'page';
export type NotificationEvent =
	`${NotificationEventTarget}:${NotificationEventType}`;

export const notificationFacade = () => {
	addNotificationEvent('user:add', 'Ваш профиль был создан');
	addNotificationEvent('user:update', 'Ваш профиль был обновлён');
	addNotificationEvent('user:remove', 'Пользователь был удалена');
	addNotificationEvent('user:reply', 'Пользователь была переслан');

	addNotificationEvent('history:add', 'История была добавлена');
	addNotificationEvent('history:update', 'История была обновлена');
	addNotificationEvent('history:remove', 'История была удалена');
	addNotificationEvent('history:reply', 'История была переслана');

	addNotificationEvent('page:add', 'Страница была добавлена');
	addNotificationEvent('page:update', 'Страница была обновлена');
	addNotificationEvent('page:remove', 'Страница была удалена');
	addNotificationEvent('page:reply', 'Страница была переслана');

	addNotificationEvent('comment:add', 'Комментарий была добавлена');
	addNotificationEvent('comment:update', 'Комментарий была обновлена');
	addNotificationEvent('comment:remove', 'Комментарий была удалена');
	addNotificationEvent('comment:reply', 'Комментарий была переслана');
};

export const addNotificationEvent = async (
	event: NotificationEvent,
	message: string,
	description?: string
) => {
	const existNotification = await db.query.notificationEvents.findFirst({
		where: eq(notificationEvents.event, event),
	});
	if (existNotification) {
		return;
	}
	const [target, type] = event.split(':') as [
		NotificationEventTarget,
		NotificationEventType
	];

	await db.insert(notificationEvents).values({
		event,
		message,
		description,
	});
};

export type NotificationData = { userId: number } & { id: number } & Record<
		string,
		any
	>;

export const notificationEvent = async (
	event: NotificationEvent,
	data: NotificationData,
	userIdx: number[] = []
) => {
	const notificationEvent = await db.query.notificationEvents.findFirst({
		where: eq(notificationEvents.event, event),
	});
	if (!notificationEvent) {
		throw new ErrorBoundary(
			'Notification not exist',
			ReasonPhrases.BAD_REQUEST
		);
	}
	const notificationPromises: Promise<
		{ id: number; createdAt: string; userId: number; notificationId: number }[]
	>[] = [];

	const idx = new Set([
		...userIdx,
		...(await notificationHandlers[event](data)),
	]);

	idx &&
		idx.forEach(userId => {
			const nPromise = db
				.insert(notificationEventsToUsers)
				.values({
					notificationId: notificationEvent.id,
					userId: userId,
					data: data,
				})
				.returning();
			notificationPromises.push(nPromise);
		});
	let resultNotification = await Promise.all(notificationPromises).then(
		data => data[0]
	);
	const response = Object.assign(notificationEvent, {
		event,
		notificationData: data,
	});

	resultNotification &&
		resultNotification.forEach(n => {
			socket.to(`notification:${n.userId}`).emit('event', response);
		});
};

export const notificationHandlers: Record<
	NotificationEvent,
	(data: NotificationData) => Promise<number[]>
> = {
	'user:update': async (data: NotificationData): Promise<number[]> => {
		return [+data.userId];
	},
	'user:add': async (data: NotificationData): Promise<number[]> => {
		return [+data.userId];
	},
	'user:remove': async (data: NotificationData): Promise<number[]> => {
		return [+data.userId];
	},
	'user:reply': async (data: NotificationData): Promise<number[]> => {
		return [+data.userId];
	},
	'history:update': async (data: NotificationData): Promise<number[]> => {
		const usersIdx = (
			await db.query.bookmarksToHistories.findMany({
				where: eq(bookmarksToHistories.historyId, data.id),
				with: {
					bookmark: {
						with: {
							user: {
								columns: {
									id: true,
								},
							},
						},
					},
				},
			})
		).map(b => b.bookmark.user.id);
		return usersIdx;
	},
	'history:add': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'history:remove': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'history:reply': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'comment:update': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'comment:add': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'comment:remove': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'comment:reply': async (data: NotificationData): Promise<number[]> => {
		throw new Error('Function not implemented.');
	},
	'page:update': async (data: NotificationData): Promise<number[]> => {
		const userIdx = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: {
											columns: {
												id: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		if (!userIdx) {
			return [];
		}
		return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
	},
	'page:add': async (data: NotificationData): Promise<number[]> => {
		const userIdx = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: {
											columns: {
												id: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		if (!userIdx) {
			return [];
		}
		return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
	},
	'page:remove': async (data: NotificationData): Promise<number[]> => {
		const userIdx = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: {
											columns: {
												id: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		if (!userIdx) {
			return [];
		}
		return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
	},
	'page:reply': async (data: NotificationData): Promise<number[]> => {
		const userIdx = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: {
											columns: {
												id: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		if (!userIdx) {
			return [];
		}
		return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
	},
};
