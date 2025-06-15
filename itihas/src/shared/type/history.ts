import { Bookmarks } from './bookmark';
import { Character } from './character';
import { CommentWithUser } from './comment';
import { Layout } from './layout';
import { LikeHistory } from './like';
import { Page } from './page';
import { PointHistory, PointPage } from './point';
import { User } from './user';

export type Filter = {
	field?: keyof History;
	value?: string;
	innerFilters?: Filter[];
	variant?: 'or' | 'and';
	operator?: 'like' | '=' | '<' | '>' | '!=';
};

export type FilterParams = {
	offset?: number;
	page?: number;
	orders?: { order: 'asc' | 'desc'; field: string }[];
	filter?: Filter[];
	author?: string;
	limit?: number;
	genres?: { genre: string; allow: string }[];
	tags?: { tag: string; allow: string }[];
};

export type History = {
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	image: string;
	views: number;
	layoutId: number;
	authorId?: number;
	status: 'complete' | 'write' | 'frozen' | 'announcement';
	type: 'free' | 'paid';
	wallpaper: string | null;
	sound: string | null;
	minAge: number | null;
	rate: number | null;
	like: null | number;
	bookmark?: string;
};

export type GenreRelation = {
	genres: {
		genre: Genre;
	}[];
};

export type HistoryAll = History & GenreRelation;

export type HistoryPage = Page & {
	points: PointPage[];
};

type similarHistory = {
	id: number;
	historyId: number;
	similarHistoryId: number;
	similar: number;
	created_at: string;
};

type similarHistoryContent = similarHistory & { similarHistory: History };

export type HistoryComment = CommentWithUser;

export type HistoryPages = History & {
	pages: HistoryPage[];
	points: PointHistory[];
	characters: Character[];
	similarHistories: similarHistoryContent[];
	comments: CommentWithUser[];
	genres: { genre: Genre }[];
	author?: User;
	bookmarks: Bookmarks[];
	likes: LikeHistory[];
	layout: Layout;
};

export type Genre = {
	id: number;
	name: string;
};

export type Progress = {
	historyId: number;
	pageId: number;
	userId: number;
	id: number;
	name: string | null;
	description: string | null;
	wrapperStyle: string | null;
	prevPageId: number | null;
	nextPageId: number | null;
};

export type ProgreseHistory = Progress & {
	page: Page;
	history: History;
	user: User;
	nextPage: Page;
	prevPage: Page;
};
