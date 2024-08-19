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

export type CommentWithUser = Comment & {
	user: User;
};
