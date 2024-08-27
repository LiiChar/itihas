import { Layout } from './layout';
import { PointPage } from './point';
import { Variable } from './variable';
import { Wallpaper } from './wallpaper';

export type Page = {
	id: number;
	name: string;
	description: string | null;
	created_at: string;
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
	history: {
		wallpaper: Wallpaper;
		layout: Layout;
	};
	wallpaper: Wallpaper | null;
	layout: Layout | null;
};
