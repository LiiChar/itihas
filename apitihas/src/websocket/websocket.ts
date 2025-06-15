import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { server } from '..';
import {
	db,
	LikeCommentInsertType,
	LikeCommentsCommentInsertType,
} from '../database/db';
import { likesToHistories } from '../database/scheme';
import { eq, sql } from 'drizzle-orm';
import {
	updateCommentHistory,
	updateCommentsCommentHistory,
	updateLikeHistory,
} from '../entities/history/history.service';
import { notificationFacade } from '../entities/modules/socket/notification';
import { handleTranscription } from '../entities/modules/socket/transcription';
import {
	handlerNotificationRead,
	handlerNotificationSubscribe,
	handlerNotificationUnsribe,
} from './notification/handler';
import {
	handlerCommentCommentsLike,
	handlerCommentLike,
} from './comment/handler';
import { handlerRoomJoin } from './socket/handler';
import { handlerHistoryLikeAdd } from './history/handler';

export type SocketClient = Socket<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	any
>;

export let socketClients: Record<number, SocketClient> = {};

export const runWebsocket = (): Server<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	any
> => {
	try {
		const io = new Server(server, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		});
		let socketEmmiter: Socket<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			any
		> | null = null;
		notificationFacade();
		io.on('connection', socket => {
			handleTranscription(socket);

			socket.on('history_like_add', handlerHistoryLikeAdd);

			socket.on('comment_like_add', handlerCommentLike);
			socket.on('comments_comment_like_add', handlerCommentCommentsLike);

			socket.on('notification_read', (data: any) => {
				handlerNotificationRead(data);
			});
			socket.on('notification_subscribe', (data: any) =>
				handlerNotificationSubscribe({ data, socket, socketClients })
			);
			socket.on('notification_unscribe', (data: any) =>
				handlerNotificationUnsribe({ data, socket, socketClients })
			);

			socket.on('room_join', (data: any) => handlerRoomJoin({ data, socket }));

			socketEmmiter = socket;
		});

		return io;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error('Произошла ошибка в работе сокетов');
		}
	}
};
