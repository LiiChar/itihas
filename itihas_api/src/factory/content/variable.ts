import { VariableInsertType } from '../../database/db';

export const VariableContent: VariableInsertType[] = [
	{
		data: '[{"name":"Евгений","message":"Ты жив?","action":"set(evgen_img,ggg);"},{"name":"Дух","message":"Как видишь","action":"set(soul_img,ggg);}]',
		type: 'object',
		variable: 'dialog',
		historyId: 102,
		userId: 1,
	},
];
