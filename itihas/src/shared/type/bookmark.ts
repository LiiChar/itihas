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
