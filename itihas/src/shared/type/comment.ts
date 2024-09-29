import { User } from './user';

export type Comment = {
	id: number;
	rate: number | null;
	historyId: number;
	content: string;
	userId: number;
	createdAt: string;
	updatedAt: string;
};

export type CommentReply = {
	id: number;
	rate: number | null;
	commentId: number;
	content: string;
	userId: number;
	createdAt: string;
	updatedAt: string;
};

export type CommentWithUser = Comment & {
	user: User;
};

export type CommentInsert = {
	userId: number;
	content: string;
	historyId: number;
};

export type CommentReplyInsert = {
	userId: number;
	content: string;
	commentId: number;
};
