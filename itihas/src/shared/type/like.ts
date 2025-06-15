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
	value: number;
	createAt: string;
};

export type FilterPage = {
	field?: keyof History;
	value?: string;
	innerFilters?: FilterPage[];
	variant?: 'or' | 'and';
	operator?: 'like' | '=' | '<' | '>' | '!=';
};

export type FilterParamsPage = {
	offset?: number;
	page?: number;
	orders?: { order: 'asc' | 'desc'; field: string }[];
	filter?: FilterPage[];
	author?: string;
	limit?: number;
};
