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
	updateLayout,
	updateSimilarHistoryRate,
} from './history.service';
import { db, LayoutType, SimilarInsertType, UserType } from '../../database/db';
import { ReplOptions } from 'repl';
import { socket } from '../..';
import { ErrorBoundary } from '../../lib/error';
import {
	authificationMiddleware,
	optionAuthificationMiddleware,
} from '../../middleware/authificationMiddleware';

const historyRouter = Router();

historyRouter.get('/', async (req: Request, res: Response) => {
	try {
		const params: Record<string, string> = req.query as any;
		const history = await getHistories(params);

		return res.json(history);
	} catch (error) {
		return res.status(404).json({ error: 'Get history failed' });
	}
});

historyRouter.post(
	'/catalog',
	optionAuthificationMiddleware,
	async (req: Request, res: Response) => {
		try {
			const params: Record<string, any> = Object.assign(req.query, req.body);
			const user = req.body.user as UserType | undefined;
			if (user) {
				params['userId'] = user.id;
			}
			const history = await getHistories(params);
			return res.json(history);
		} catch (error) {
			if (error instanceof Error) {
				return res
					.status(StatusCodes.INTERNAL_SERVER_ERROR)
					.json({ error: 'Get history failed cause ' + error.message });
			}
		}
	}
);

historyRouter.post(
	'/',
	authificationMiddleware,
	async (req: Request, res: Response) => {
		try {
			const dataHistory = req.body;
			const user = req.body.user;

			const history = await createHistory({
				...dataHistory,
				authorId: dataHistory.authorId ?? user.id,
			});
			return res.json(history).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ error: 'Failed create new history' });
			}
		}
	}
);

historyRouter.get('/layout', async (req: Request, res: Response) => {
	const layouts = await getLayouts();
	return res.json(layouts);
});
historyRouter.put(
	'/layout',
	authificationMiddleware,
	async (req: Request, res: Response) => {
		const user = req.body.user;
		const data = req.body as Partial<LayoutType>;
		const layouts = await updateLayout(user.id, data.id!, data);
		return res.json(layouts);
	}
);

historyRouter.get('/:id/similar', async (req: Request, res: Response) => {
	const id = req.params.id;
	if (!id) {
		throw new ErrorBoundary('Params not request', ReasonPhrases.BAD_REQUEST);
	}
	const similars = await getSimilarHistory(+id!);
	return res.json(similars);
});

historyRouter.post(
	'/similar',
	authificationMiddleware,
	async (req: Request, res: Response) => {
		const data = req.body as SimilarInsertType;
		const createdSimilar = await addSimilarHistory(data);
		return res.json(createdSimilar);
	}
);

historyRouter.put(
	'/similar/rate',
	authificationMiddleware,
	async (req: Request, res: Response) => {
		const rate = req.body as { rate: number };
		const data = req.body as any;
		const createdSimilar = await updateSimilarHistoryRate(data);
		return res.json(createdSimilar);
	}
);

historyRouter.put(
	'/:id',
	authificationMiddleware,
	async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const data = req.body;
			const history = await updateHistory(+id!, data);
			return res.json(history);
		} catch (error) {
			return res.status(404).json({ error: 'Update history failed' });
		}
	}
);

historyRouter.get(
	'/:id',
	optionAuthificationMiddleware,
	async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const user = req.body.user;
			const history = await getHistory(parseInt(id), user);
			return res.json(history).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error)
				return res
					.status(500)
					.json({ error: 'Get history by id failed cause' + error.message });
		}
	}
);

export { historyRouter };
