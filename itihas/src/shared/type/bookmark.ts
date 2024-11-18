import { HistoryAll } from './history';

export type Bookmark = {
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
	userId: number;
};

export type BookmarkToHistory = {
	id: number;
	createdAt: string;
	historyId: number;
	bookmarkId: number;
};
export type Bookmarks = BookmarkToHistory & {
	bookmark: Bookmark;
};

export type BookmarkToHistories = {
	id: number;
	createdAt: string;
	bookmarkId: number;
	historyId: number;
};

export type BookmarkWithHistories = Bookmark & {
	histories: (BookmarkToHistories & {
		history: HistoryAll;
	})[];
};
