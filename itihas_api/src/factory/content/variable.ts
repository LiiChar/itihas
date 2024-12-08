import { VariableInsertType } from '../../database/db';

export const VariableContent: VariableInsertType[] = [
	{
		data: '[{"name":"Евгений","message":"Ты жив?"},{"name":"Дух","message":"Как видишь"}]',
		type: 'array',
		variable: 'dialog',
		historyId: 102,
		userId: 1,
	},
];
