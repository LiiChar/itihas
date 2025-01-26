import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LayoutType, PageType, db } from '../../database/db';
import {
	createPage,
	createPagePoint,
	deleteActionById,
	executeActionPage,
	getCurrentPageByHistoryId,
	getPage,
	getPageList,
	getPages,
	runCode,
	updateAction,
	updateLayoutPage,
	updatePage,
} from './page.service';
import { validateData } from '../../middleware/validationMiddleware';
import {
	pageInsertSchema,
	pagePointInsertScheme,
	pagePointUpdateScheme,
	runCodeScheme,
} from './page.scheme';
import { getUser } from '../user/user.service';
import { parse, run } from './lib/actionV2';
import { ErrorBoundary } from '../../lib/error';
import { notificationEvent } from '../modules/socket/notification';

const pageRouter = Router();

pageRouter.get('/list', async (req: Request, res: Response) => {
	const historyId = req.query.historyId;
	const pages = await getPageList(
		historyId ? (+historyId as number) : undefined
	);

	return res.json(pages);
});

pageRouter.post('/filter', async (req: Request, res: Response) => {
	const params: Record<string, string> = Object.assign(req.query, req.body);
	const pages = await getPages(params);
	return res.json(pages);
});

pageRouter.post(
	'/code',
	validateData(runCodeScheme),
	async (req: Request, res: Response) => {
		try {
			const { code, historyId, userId } = req.body as runCodeScheme;
			const pageId = await runCode(code, historyId, userId);
			return res
				.json({ pageId, message: 'Code succefully execute' })
				.status(200);
		} catch (error) {
			if (error instanceof Error) return res.json(error.message).status(500);
		}
	}
);

pageRouter.post(
	'/:id',
	validateData(pageInsertSchema),
	async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const user = (await db.query.users.findMany())[0];
			const data: pageInsertSchema = req.body;
			const page = await createPage(parseInt(id), data);
			const resPage = await getCurrentPageByHistoryId(
				page.historyId,
				page.id,
				user
			);
			await notificationEvent(
				'page:update',
				Object.assign(page, { userId: +user.id, id: +page.id })
			);
			return res.json(resPage).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error) return res.json(error.message).status(500);
			if (error instanceof ErrorBoundary)
				return res.json(error.message).status(500);
		}
	}
);

pageRouter.put('/layout/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		if (!id) {
			throw Error('Id not found in params');
		}
		const user = (await db.query.users.findMany())[0];
		const data = req.body as Partial<LayoutType>;
		const layouts = await updateLayoutPage(user.id, +id, data.id!, data);
		return res.json(layouts);
	} catch (error) {
		if (error instanceof Error) return res.json(error.message).status(500);
	}
});

pageRouter.put(
	'/action/:action',
	validateData(pagePointUpdateScheme),
	async (req: Request, res: Response) => {
		try {
			const action = req.params.action;
			const data = req.body;
			const page = await updateAction(parseInt(action), data);
			return res.json(page).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error) return res.json(error.message).status(500);
		}
	}
);

pageRouter.delete('/action/:action', async (req: Request, res: Response) => {
	try {
		const action = req.params.action;
		const page = await deleteActionById(parseInt(action));
		return res.json(page).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) return res.json(error.message).status(500);
	}
});

pageRouter.get('/action/:action', async (req: Request, res: Response) => {
	try {
		const action = req.params.action;
		const user = (await db.query.users.findMany())[0];
		const page = await executeActionPage(parseInt(action), user);
		return res.json(page).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) return res.json(error.message).status(500);
	}
});

pageRouter.put('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const user = (await db.query.users.findMany())[0];
		const data: Partial<PageType> = req.body;
		const page = await updatePage(parseInt(id), data);
		await notificationEvent(
			'page:add',
			Object.assign(page, { userId: +user.id, id: +page.id })
		);

		return res.json(page).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) return res.json(error.message).status(500);
	}
});

pageRouter.post(
	'/:currentPage/point',
	validateData(pagePointInsertScheme),
	async (req: Request, res: Response) => {
		try {
			const id = req.params.currentPage;
			const data: (typeof pagePointInsertScheme)['_output'] = req.body;
			const user = (await db.query.users.findMany())[0];
			const page = await createPagePoint(parseInt(id), data);
			return res.json(page).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error) return res.json(error.message).status(500);
		}
	}
);

pageRouter.get('/:id/:currentPage', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const userId = req.query.userId;
		const currentPage = req.params.currentPage;
		let user = (await db.query.users.findMany()).find(
			el => el.id == +`${userId ?? 1}`
		);
		if (!user) {
			user = (await db.query.users.findMany())[0];
		}
		const page = await getCurrentPageByHistoryId(
			parseInt(id),
			parseInt(currentPage),
			user
		);
		return res.json(page).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) return res.json(error.message).status(500);
	}
});

pageRouter.get('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;

		if (!id) {
			throw Error('Id not found in params');
		}
		const page = await getPage(parseInt(id));
		return res.json(page).status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) return res.json(error.message).status(500);
	}
});

export { pageRouter };
