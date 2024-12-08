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
	return res.json(varableValues).status(StatusCodes.OK);
});

variableRouter.get('/', async (req: Request, res: Response) => {
	const { history, user } = req.query;
	if (!history && !user) {
		return res.json('Не пришли параметры').status(StatusCodes.BAD_REQUEST);
	}
	const varableValues = await getVariables(+history!, +user!);
	return res.json(varableValues).status(StatusCodes.OK);
});

variableRouter.get('/user', async (req: Request, res: Response) => {
	const user = req.query.user;
	if (!user) {
		return res.json('Не пришли параметры').status(StatusCodes.BAD_REQUEST);
	}
	const varableValues = await getVariablesByUser(+user);
	return res.json(varableValues).status(StatusCodes.OK);
});

variableRouter.get('/history', async (req: Request, res: Response) => {
	const history = req.query.history;
	if (!history) {
		return res.json('Не пришли параметры').status(StatusCodes.BAD_REQUEST);
	}
	const varableValues = await getVariableshistory(+history);
	return res.json(varableValues).status(StatusCodes.OK);
});

export { variableRouter };
