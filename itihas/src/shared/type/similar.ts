import { History } from './history';

export type SimilarType = {
	historyId: number;
	similarHistoryId: number;
	id?: number | undefined;
	created_at?: string | undefined;
	similar?: number | undefined;
};

export type SimilarWithHistory = SimilarType & {
	history: History;
	similarHistory: History;
};
