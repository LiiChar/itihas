import { or, eq, and, SQL } from 'drizzle-orm';
import { db, VariableInsertType, VariableType } from '../../../database/db';
import { variables } from '../../page/model/page';
import { ErrorBoundary } from '../../../lib/error';
import { ReasonPhrases } from 'http-status-codes';
import { getTypeFromValue } from '../../../lib/type';
import { users } from '../../user/model/user';
import { histories } from '../../history/model/history';

type Data = Record<
	string,
	{
		data: string;
		key: string;
		type: VariableType['type'];
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
				.set({
					variable: data[k].key,
					data: data[k].data,
					type: data[k]?.type,
				})
				.where(and(eq(variables.variable, k), ...sqls));
			requests.push(req);
		} else {
			const value: VariableInsertType = {
				variable: data[k].key,
				data: data[k].data,
				historyId: historyId!,
				type: data[k]?.type ?? getTypeFromValue(data[k].data),
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
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
	});

	if (!user) {
		throw new ErrorBoundary(
			'Пользователя не существует',
			ReasonPhrases.BAD_REQUEST
		);
	}
	const history = await db.query.histories.findFirst({
		where: eq(histories.id, historyId),
	});
	if (!history) {
		throw new ErrorBoundary('Истории не существует', ReasonPhrases.BAD_REQUEST);
	}

	if (history.authorId == userId) {
		const variable = await db.query.variables.findMany({
			where: eq(variables.historyId, historyId),
		});
		return variable;
	}

	const variablesData = await db.query.variables.findMany({
		where: and(
			eq(variables.historyId, historyId),
			eq(variables.userId, userId)
		),
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
