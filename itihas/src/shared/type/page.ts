import { Variable } from './variable';

export type Page = {
	id: number;
	name: string;
	description: string | null;
	created_at: string;
	image: string;
	sound: string | null;
	historyId: number;
	script: string | null;
	content: string;
};

export type ReadPage = Page & {
	variables: Variable[];
};
