import { eq } from 'drizzle-orm';
import {
	db,
	LikeCommentInsertType,
	LikeCommentsCommentInsertType,
} from '../../database/db';
import {
	updateCommentHistory,
	updateCommentsCommentHistory,
} from '../../entities/history/history.service';
import { socket } from '../..';

export const handlerCommentCommentsLike = async ({
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
	socket
		.to('history:' + commentsCommentId)
		.emit(
			'comments_comment_like_update',
			Object.assign({ userId, commentsCommentId, variant }, likes)
		);
};

export const handlerCommentLike = async ({
	commentId,
	userId,
	variant,
}: LikeCommentInsertType) => {
	try {
		console.log(commentId, userId, variant);

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
		socket
			.to('history:' + commentLikes?.historyId)
			.emit(
				'comment_like_update',
				Object.assign({ userId, commentId, variant }, likes)
			);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error('Произошла ошибка в добавлении реакции для комментария');
		}
	}
};
