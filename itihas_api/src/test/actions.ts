import { and, eq } from 'drizzle-orm';
import { db } from '../database/db';
import { executeAction } from '../entities/page/lib/action';
import { variables } from '../database/scheme';

export const actionsTest = async () => {
	const user = (await db.query.users.findMany())[0];
	const actions =
		'set(name,50);var(hp,query(name););dif(hp,10);if({5,<,10}{var(page,10);}{var(page,5);});set(hp,page);move(get(page););';
	await executeAction(1, user, actions);
	const variablesList = await db.query.variables.findFirst({
		where: and(eq(variables.userId, user.id), eq(variables.historyId, 1)),
	});
	console.log(variablesList);
};
