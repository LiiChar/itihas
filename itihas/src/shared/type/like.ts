import { Page } from './page';

export type LikePage = {
	id: number;
	pageId: number;
	userId: number;
};

export type LikeWithPage = LikePage & {
	page: Page;
};

export type LikeHistory = {
	id: number;
	userId: number;
	historyId: number;
	variant: 'negative' | 'positive';
	createAt: string;
};
