import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	createHistory,
	getHistories,
	getHistory,
	getLayouts,
} from './history.service';
import { db } from '../../database/db';

const historyRouter = Router();

historyRouter.get('/', async (req: Request, res: Response) => {
	try {
		const history = await getHistories();
		return res.json(history).status(StatusCodes.OK);
	} catch (error) {
		console.log(error);
		return res
			.json('Get history failed')
			.status(StatusCodes.INTERNAL_SERVER_ERROR);
	}
});

historyRouter.post('/', async (req: Request, res: Response) => {
	const dataHistory = req.body;
	const user = (await db.query.users.findMany())[0];

	const history = await createHistory(dataHistory);
	return res.json(history).status(StatusCodes.OK);
});

historyRouter.get('/layout', async (req: Request, res: Response) => {
	const layouts = await getLayouts();
	return res.json(layouts);
});

historyRouter.get('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const user = (await db.query.users.findMany())[0];
		const history = await getHistory(parseInt(id), user);
		return res.json(history).status(StatusCodes.OK);
	} catch (error) {
		console.log(error);

		return res
			.json('Get history by id failed')
			.status(StatusCodes.INTERNAL_SERVER_ERROR);
	}
});

export { historyRouter };
