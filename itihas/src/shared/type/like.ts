import { Page } from './page';

export type LikePage = {
	id: number;
	pageId: number;
	userId: number;
};

export type LikeWithPage = LikePage & {
	page: Page;
};
