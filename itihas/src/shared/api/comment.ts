import { URL } from '../const/const';
import {
	Comment,
	CommentInsert,
	CommentReply,
	CommentReplyInsert,
} from '../type/comment';
import { axi } from './axios/axios';

const BASE_URL = `${URL}/comment`;

export const createComment = async (comment: CommentInsert) => {
	const histories = await axi.post<Comment>(BASE_URL, comment);
	return histories;
};

export const createReplyComment = async (commentReply: CommentReplyInsert) => {
	const history = await axi.post<CommentReply>(
		BASE_URL + '/reply',
		commentReply
	);
	return history.data;
};
