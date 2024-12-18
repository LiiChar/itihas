import { URL } from '../const/const';
import {
	Comment,
	CommentInsert,
	CommentReply,
	CommentReplyInsert,
	CommentReplyWithUser,
} from '../type/comment';
import { axi } from './axios/axios';

const BASE_URL = `${URL}/comment`;

export const createComment = async (comment: CommentInsert) => {
	const histories = await axi.post<Comment>(BASE_URL, comment);
	return histories;
};

export const createReplyComment = async (
	commentReply: CommentReplyInsert,
	historyId?: number
) => {
	const history = await axi.post<CommentReply>(
		BASE_URL + '/reply' + '/?historyId=' + historyId,
		commentReply
	);
	return history.data;
};

export const getReplyComment = async (commnetReplyId: number) => {
	const replyComment = await axi.get<CommentReplyWithUser[]>(
		BASE_URL + '/reply/' + commnetReplyId
	);
	return replyComment.data;
};
