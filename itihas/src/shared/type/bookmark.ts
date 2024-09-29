import { HistoryAll } from './history';

export type bookmark = {
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
	userId: number;
};

export type bookmarkToHistory = {
	id: number;
	createdAt: string;
	historyId: number;
	bookmarkId: number;
};
export type bookmarks = bookmarkToHistory & {
	bookmark: bookmark;
};

export type BookmarkToHistories = {
	id: number;
	createdAt: string;
	bookmarkId: number;
	historyId: number;
};

export type BookmarkWithHistories = bookmark & {
	histories: (BookmarkToHistories & {
		history: HistoryAll;
	})[];
};
