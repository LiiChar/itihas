import { Character } from './character';
import { Layout } from './layout';
import { PointPage } from './point';
import { Variable } from './variable';
import { Wallpaper } from './wallpaper';
import { History } from './history';

export type PageInsert = {
	name: string;
	description?: string;
	action: string;
	image?: string;
	content: string;
	sound?: string;
};

export type PagePointInsert = {
	name: string;
	action: string;
};

export type Page = {
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
	image: string;
	wallpaper: string | null;
	sound: string | null;
	historyId: number;
	script: string | null;
	content: string;
};

export type ReadPage = Page & {
	variables: Variable[];
	points: PointPage[];
	characters: Character[];
	history: History & {
		wallpaper: Wallpaper;
		layout: Layout;
	};
	wallpaper: Wallpaper | null;
	layout: Layout | null;
};

export type SimilarHistory = {
	id: number;
	created_at: string;
	historyId: number;
	similarHistoryId: number;
	similar: number | null;
};

export type PageWithHistory = Page & {
	history: History;
};
