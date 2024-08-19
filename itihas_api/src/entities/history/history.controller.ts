import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getHistories, getHistory } from './history.service';
import { db } from '../../database/db';

const historyRouter = Router();

historyRouter.get('/', async (req: Request, res: Response) => {
	const history = await getHistories();
	return res.json(history).status(StatusCodes.OK);
});

historyRouter.get('/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = (await db.query.users.findMany())[0];
	const history = await getHistory(parseInt(id), user);
	return res.json(history).status(StatusCodes.OK);
});

export { historyRouter };
