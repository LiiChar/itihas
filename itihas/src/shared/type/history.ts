import { bookmarks } from './bookmark';
import { Character } from './character';
import { Comment } from './comment';
import { Page } from './page';
import { PointHistory, PointPage } from './point';
import { User } from './user';

export type History = {
	id: number;
	name: string;
	description: string | null;
	created_at: string;
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

export type HistoryComment = Comment & {
	user: User;
};

export type HistoryPages = History & {
	pages: HistoryPage[];
	points: PointHistory[];
	characters: Character[];
	similarHistories: similarHistoryContent[];
	comments: HistoryComment[];
	genres: { genre: Genre }[];
	author: User;
	bookmarks: bookmarks[];
};

export type Genre = {
	id: number;
	name: string;
};
