export type Variable = {
	id: number;
	data: any;
	historyId: number;
	userId: number;
	variable: string;
	type: 'string' | 'number' | 'object' | 'array';
};
