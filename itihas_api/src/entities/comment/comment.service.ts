import { socket } from '../..';
import { db } from '../../database/db';
import { comments, commentsToComments } from '../history/model/history';
import { commentInsertSchema, replyInsertSchema } from './comment.scheme';

export const createComment = async (comment: commentInsertSchema) => {
	const commentCreated = (
		await db.insert(comments).values(comment).returning()
	)[0];
	socket.to('history:' + comment.historyId).emit('history_add_comment');
	return commentCreated;
};

export const createReplyComment = async (comment: replyInsertSchema) => {
	const commentReplyCreated = (
		await db.insert(commentsToComments).values(comment).returning()
	)[0];

	return commentReplyCreated;
};
