import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { server } from '..';
import {
	db,
	LikeCommentInsertType,
	LikeCommentsCommentInsertType,
} from '../database/db';
import { likesToHistories } from '../database/scheme';
import { eq } from 'drizzle-orm';
import {
	updateCommentHistory,
	updateCommentsCommentHistory,
	updateLikeHistory,
} from '../entities/history/history.service';
import { notificationFacade } from '../entities/modules/socket/notification';
import { handleTranscription } from '../entities/modules/socket/transcription';

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
		// handle like history
		socket.on(
			'history_like_add',
			async ({
				historyId,
				userId,
				variant,
			}: {
				historyId: number;
				userId: number;
				variant: 'negative' | 'positive';
			}) => {
				await updateLikeHistory({ historyId, userId, variant });
				const historyLikes = await db.query.histories.findFirst({
					where: histories => eq(histories.id, historyId),
					with: {
						likes: true,
					},
				});
				const likes = historyLikes?.likes.reduce<{
					positiveLike: number;
					negativeLike: number;
				}>(
					(acc, like) => {
						if (like.variant == 'positive') {
							acc.positiveLike++;
						} else {
							acc.negativeLike++;
						}
						return acc;
					},
					{ positiveLike: 0, negativeLike: 0 }
				);
				io.to('history:' + historyId).emit(
					'history_like_update',
					Object.assign({ userId, historyId }, likes)
				);
			}
		);
		// handle comment history
		socket.on(
			'comment_like_add',
			async ({ commentId, userId, variant }: LikeCommentInsertType) => {
				await updateCommentHistory({ commentId, userId, variant });
				const commentLikes = await db.query.comments.findFirst({
					where: comment => eq(comment.id, commentId),
					with: {
						likes: true,
					},
				});
				const likes = commentLikes?.likes.reduce<{
					positiveLike: number;
					negativeLike: number;
				}>(
					(acc, like) => {
						if (like.variant == 'positive') {
							acc.positiveLike++;
						} else {
							acc.negativeLike++;
						}
						return acc;
					},
					{ positiveLike: 0, negativeLike: 0 }
				);
				io.to('history:' + commentLikes?.historyId).emit(
					'comment_like_update',
					Object.assign({ userId, commentId, variant }, likes)
				);
			}
		);

		socket.on(
			'comments_comment_like_add',
			async ({
				commentsCommentId,
				userId,
				variant,
			}: LikeCommentsCommentInsertType) => {
				await updateCommentsCommentHistory({
					commentsCommentId,
					userId,
					variant,
				});
				const commentLikes = await db.query.commentsToComments.findFirst({
					where: comment => eq(comment.id, commentsCommentId),
					with: {
						likes: true,
					},
				});
				const likes = commentLikes?.likes.reduce<{
					positiveLike: number;
					negativeLike: number;
				}>(
					(acc, like) => {
						if (like.variant == 'positive') {
							acc.positiveLike++;
						} else {
							acc.negativeLike++;
						}
						return acc;
					},
					{ positiveLike: 0, negativeLike: 0 }
				);
				io.to('history:' + commentsCommentId).emit(
					'comments_comment_like_update',
					Object.assign({ userId, commentsCommentId, variant }, likes)
				);
			}
		);

		socket.on('notification_subscribe', (data: { userId: number }) => {
			if (!data.userId) {
				return;
			}
			socketClients[data.userId] = socket;
			socket.join(`notification:${data.userId}`);
		});
		socket.on('notification_unscribe', (data: { userId: number }) => {
			if (!data.userId) {
				return;
			}
			delete socketClients[data.userId];
			socket.leave(`notification:${data.userId}`);
		});

		socket.on(
			'room_join',
			({
				id,
				typeRoom,
			}: {
				typeRoom: 'history' | 'page' | 'read';
				id: number;
			}) => {
				socket.join(`${typeRoom}:${id}`);
				socket.emit(`${typeRoom}_room_join`, `${typeRoom}:${id}`);
			}
		);

		socketEmmiter = socket;
	});

	return io;
};
