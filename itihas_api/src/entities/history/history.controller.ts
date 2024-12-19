import { Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
	addSimilarHistory,
	createHistory,
	getHistories,
	getHistory,
	getLayouts,
	getSimilarHistory,
	updateHistory,
	updateSimilarHistoryRate,
} from './history.service';
import { db, SimilarInsertType } from '../../database/db';
import { ReplOptions } from 'repl';
import { socket } from '../..';
import { ErrorBoundary } from '../../lib/error';

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

historyRouter.get('/:id/similar', async (req: Request, res: Response) => {
	const id = req.params.id;
	if (!id) {
		throw new ErrorBoundary('Params not request', ReasonPhrases.BAD_REQUEST);
	}
	const similars = await getSimilarHistory(+id!);
	return res.json(similars);
});

historyRouter.post('/similar', async (req: Request, res: Response) => {
	const data = req.body as SimilarInsertType;
	const createdSimilar = await addSimilarHistory(data);
	return res.json(createdSimilar);
});

historyRouter.put('/similar/rate', async (req: Request, res: Response) => {
	const rate = req.body as { rate: number };
	const data = req.body as any;
	const createdSimilar = await updateSimilarHistoryRate(data);
	return res.json(createdSimilar);
});

historyRouter.put('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const data = req.body;
		const history = await updateHistory(+id!, data);
		return res.json(history).status(StatusCodes.OK);
	} catch (error) {
		console.log(error);
		return res.json('Update history failed').status(404);
	}
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
