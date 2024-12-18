import { User } from './user';

export type Comment = {
	id: number;
	rate: number | null;
	historyId: number;
	content: string;
	userId: number;
	createdAt: string;
	likes: CommentLike[];

	updatedAt: string;
};

export type CommentLike = {
	userId: number;
	variant: 'negative' | 'positive';
	id: number;
	createdAt: string;
	commentId: number;
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

export type CommentReplyWithUser = CommentReply & {
	user: User;
	likes: CommentLike[];
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
