import { or, eq, and, SQL } from 'drizzle-orm';
import { db, VariableInsertType } from '../../../database/db';
import { variables } from '../../page/model/page';
import { ErrorBoundary } from '../../../lib/error';
import { ReasonPhrases } from 'http-status-codes';
import { getTypeFromValue } from '../../../lib/type';

type Data = Record<
	string,
	{
		data: string;
		key: string;
	}
>;

export const setVaribles = async (
	data: Data,
	historyId?: number,
	userId?: number
) => {
	const keys = Object.keys(data);
	const requests: any[] = [];
	const sqls: SQL[] = [];
	if (!historyId && !userId) {
		throw new ErrorBoundary('', ReasonPhrases.BAD_REQUEST);
	}
	if (historyId) {
		sqls.push(eq(variables.historyId, historyId));
	}
	if (userId) {
		sqls.push(eq(variables.userId, userId));
	}
	const variablesArray = await db.query.variables.findMany({
		where: and(...sqls),
	});
	keys.forEach(async k => {
		const exist = variablesArray.find(v => v.variable == k);
		if (exist) {
			const req = db
				.update(variables)
				.set({ variable: data[k].key, data: data[k].data })
				.where(and(eq(variables.variable, k), ...sqls));
			requests.push(req);
		} else {
			const value: VariableInsertType = {
				variable: data[k].key,
				data: data[k].data,
				historyId: historyId!,
				type: getTypeFromValue(data[k].data),
				userId: userId!,
			};
			const req = db.insert(variables).values(value);
			requests.push(req);
		}
	});
	await Promise.all(requests);
	return true;
};

export const getVariables = async (historyId: number, userId: number) => {
	const variablesData = await db.query.variables.findMany({
		where: or(eq(variables.historyId, historyId), eq(variables.userId, userId)),
		with: {
			history: true,
		},
	});

	return variablesData;
};

export const getVariablesByUser = async (userId: number) => {
	const variablesData = await db.query.variables.findMany({
		where: eq(variables.userId, userId),
		with: {
			history: true,
		},
	});

	return variablesData;
};

export const getVariableshistory = async (historyId: number) => {
	const variablesData = await db.query.variables.findMany({
		where: eq(variables.historyId, historyId),
		with: {
			history: true,
		},
	});

	return variablesData;
};
