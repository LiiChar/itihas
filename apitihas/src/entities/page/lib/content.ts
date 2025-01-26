import { and, eq } from 'drizzle-orm';
import { db, VariableType } from '../../../database/db';
import { variables } from '../model/page';

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

	const mathchesVariable = Array.from(content.matchAll(/{=([^{}=]+)}/gm));

	let value = insertDataToString(content, variabs, mathchesVariable);

	let mathchesVariableAgain = Array.from(value.matchAll(/{=([^{}=]+)}/gm));
	let countTry = 0;
	while (mathchesVariableAgain.length > 0 && countTry < 5) {
		value = insertDataToString(value, variabs, mathchesVariableAgain);

		mathchesVariableAgain = Array.from(value.matchAll(/{=([^{}=]+)}/gm));
		countTry++;
	}
	return value;
};

export const insertDataToString = (
	content: string,
	variabs: VariableType[],
	mathchesVariable: RegExpExecArray[]
) => {
	mathchesVariable.forEach(reg => {
		const regex = new RegExp('{=' + reg[1] + '}', 'm');

		if (reg[1].includes('.')) {
			const nestedValue = reg[1].split('.');
			const variableSearch = variabs.find(
				ver => ver.variable == nestedValue.shift()
			);
			if (variableSearch && variableSearch.data) {
				let parsedData = JSON.parse(variableSearch.data);
				nestedValue.forEach(v => {
					if (Number.isInteger(v)) {
						parsedData = parsedData[Math.trunc(+v)];
					} else {
						parsedData = parsedData[v];
					}
				});
				if (typeof parsedData == 'string') {
					content = content.replace(regex, parsedData);
				}
			}
		} else {
			const variableSearch =
				variabs.find(ver => ver.variable == reg[1])?.data ?? '';
			content = content.replace(regex, variableSearch);
		}
	});
	return content;
};
