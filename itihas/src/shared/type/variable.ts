export type Variable = {
	id: number;
	data: string;
	historyId: number;
	userId: number;
	variable: string;
	type: 'string' | 'number' | 'object' | 'array';
};
