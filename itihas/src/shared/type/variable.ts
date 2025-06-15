import { History } from './history';

export type Variable = {
	id: number;
	data: any;
	historyId: number;
	userId: number;
	variable: string;
	type: 'string' | 'number' | 'object' | 'array';
};

export type VariableHistory = Variable & {
	history: History;
};
