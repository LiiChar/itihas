import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	createHistory,
	getHistories,
	getHistory,
	getLayouts,
} from './history.service';
import { db } from '../../database/db';
import { ReplOptions } from 'repl';

const historyRouter = Router();

historyRouter.get('/', async (req: Request, res: Response) => {
	try {
		const params: Record<string, string> = req.query as any;
		const history = await getHistories(params);
		return res.json(history).status(StatusCodes.OK);
	} catch (error) {
		console.log(error);
		return res.json('Get history failed').status(404);
	}
});

historyRouter.post('/catalog', async (req: Request, res: Response) => {
	try {
		const params: Record<string, string> = Object.assign(req.query, req.body);
		const history = await getHistories(params);
		return res.json(history).status(StatusCodes.OK);
	} catch (error) {
		console.log(error);
		return res
			.json('Get history failed')
			.status(StatusCodes.INTERNAL_SERVER_ERROR);
	}
});

historyRouter.post('/', async (req: Request, res: Response) => {
	try {
		const dataHistory = req.body;
		const user = (await db.query.users.findMany())[0];

		const history = await createHistory({
			...dataHistory,
			authorId: dataHistory.authorId ?? user.id,
		});
		return res.json(history).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) {
			return res.json(error.message).status(StatusCodes.BAD_REQUEST);
		}
	}
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
