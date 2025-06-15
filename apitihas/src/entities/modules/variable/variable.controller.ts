import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	getVariables,
	getVariablesByUser,
	getVariableshistory,
	setVaribles,
} from './variable.service';

const variableRouter = Router();

variableRouter.post('/', async (req: Request, res: Response) => {
	const { history, user } = req.query;
	const data = req.body;
	const varableValues = await setVaribles(data, +history!, +user!);
	return res.json(varableValues);
});

variableRouter.get('/', async (req: Request, res: Response) => {
	try {
		const { history, user } = req.query;
		if (!history && !user) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Не пришли параметры' });
		}
		const varableValues = await getVariables(+history!, +user!);
		return res.json(varableValues).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(500)
				.json({ error: 'Не удалосғ получитғ переменные истории' });
		}
	}
});

variableRouter.get('/user', async (req: Request, res: Response) => {
	const user = req.query.user;
	if (!user) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Не пришли параметры' });
	}
	const varableValues = await getVariablesByUser(+user);
	return res.json(varableValues);
});

variableRouter.get('/history', async (req: Request, res: Response) => {
	const history = req.query.history;
	if (!history) {
		return res.json('Не пришли параметры').status(StatusCodes.BAD_REQUEST);
	}
	const varableValues = await getVariableshistory(+history);
	return res.json(varableValues);
});

export { variableRouter };
