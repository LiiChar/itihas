import { and, eq } from 'drizzle-orm';
import { db } from '../../../database/db';
import { variables } from '../../page/model/page';

export const insertDataToContent = async (
	content: string,
	historyId: number,
	userId: number
) => {
	const variabs = await db.query.variables.findMany({
		where: and(
			eq(variables.historyId, historyId),
			eq(variables.userId, userId)
		),
	});
	const mathchesVariable = Array.from(content.matchAll(/{=(.*?)}/gm));
	mathchesVariable.forEach(reg => {
		const regex = new RegExp('{=' + reg[1] + '}', 'gm');
		const variableSearch =
			variabs.find(ver => ver.variable == reg[1])?.data ??
			'такого значения нет';
		content = content.replace(/{=name}/gm, variableSearch);
	});
	return content;
};
