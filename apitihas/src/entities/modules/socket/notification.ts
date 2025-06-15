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
import { bookmarksToHistories, comments } from '../../history/model/history';
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

	addNotificationEvent('comment:add', 'Комментарий был добавлен');
	addNotificationEvent('comment:update', 'Комментарий был обновлён');
	addNotificationEvent('comment:remove', 'Комментарий был удалён');
	addNotificationEvent('comment:reply', 'Комментарий был переслан');
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
	'user:update': async data => [+data.userId],
	'user:add': async data => [+data.userId],
	'user:remove': async data => [+data.userId],
	'user:reply': async data => [+data.userId],

	'history:update': async data => {
		const users = await db.query.bookmarksToHistories.findMany({
			where: eq(bookmarksToHistories.historyId, data.id),
			with: {
				bookmark: {
					with: {
						user: {
							columns: { id: true },
						},
					},
				},
			},
		});
		return users.map(b => b.bookmark.user.id);
	},
	'history:add': async data => {
		const users = await db.query.bookmarksToHistories.findMany({
			where: eq(bookmarksToHistories.historyId, data.id),
			with: {
				bookmark: {
					with: {
						user: {
							columns: { id: true },
						},
					},
				},
			},
		});
		return users.map(b => b.bookmark.user.id);
	},
	'history:remove': async data => {
		const users = await db.query.bookmarksToHistories.findMany({
			where: eq(bookmarksToHistories.historyId, data.id),
			with: {
				bookmark: {
					with: {
						user: {
							columns: { id: true },
						},
					},
				},
			},
		});
		return users.map(b => b.bookmark.user.id);
	},
	'history:reply': async data => {
		const users = await db.query.bookmarksToHistories.findMany({
			where: eq(bookmarksToHistories.historyId, data.id),
			with: {
				bookmark: {
					with: {
						user: {
							columns: { id: true },
						},
					},
				},
			},
		});
		return users.map(b => b.bookmark.user.id);
	},

	'comment:add': async data => {
		const comment = await db.query.comments.findFirst({
			where: eq(comments.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: {
											columns: { id: true },
										},
									},
								},
							},
						},
					},
				},
			},
		});
		if (!comment || !comment.history) return [];
		return comment.history.bookmarks.map(b => b.bookmark.user.id);
	},
	'comment:update': async data => {
		const comment = await db.query.comments.findFirst({
			where: eq(comments.id, data.id),
			with: {
				user: {
					columns: { id: true },
				},
			},
		});
		return comment ? [comment.user.id] : [];
	},
	'comment:remove': async data => {
		const comment = await db.query.comments.findFirst({
			where: eq(comments.id, data.id),
			with: {
				user: {
					columns: { id: true },
				},
			},
		});
		return comment ? [comment.user.id] : [];
	},
	'comment:reply': async data => {
		const comment = await db.query.comments.findFirst({
			where: eq(comments.id, data.id),
			with: {
				user: {
					columns: { id: true },
				},
			},
		});
		return comment ? [comment.user.id] : [];
	},

	'page:update': async data => {
		const page = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: { columns: { id: true } },
									},
								},
							},
						},
					},
				},
			},
		});
		return page?.history?.bookmarks.map(b => b.bookmark.user.id) || [];
	},
	'page:add': async data => {
		const page = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: { columns: { id: true } },
									},
								},
							},
						},
					},
				},
			},
		});
		return page?.history?.bookmarks.map(b => b.bookmark.user.id) || [];
	},
	'page:remove': async data => {
		const page = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: { columns: { id: true } },
									},
								},
							},
						},
					},
				},
			},
		});
		return page?.history?.bookmarks.map(b => b.bookmark.user.id) || [];
	},
	'page:reply': async data => {
		const page = await db.query.pages.findFirst({
			where: eq(pages.id, data.id),
			with: {
				history: {
					with: {
						bookmarks: {
							with: {
								bookmark: {
									with: {
										user: { columns: { id: true } },
									},
								},
							},
						},
					},
				},
			},
		});
		return page?.history?.bookmarks.map(b => b.bookmark.user.id) || [];
	},
};
