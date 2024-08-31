import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../../database/db';
import {
	createPage,
	createPagePoint,
	executeActionPage,
	getCurrentPageByHistoryId,
} from './page.service';
import { validateData } from '../../middleware/validationMiddleware';
import { pageInsertSchema, pagePointInsertScheme } from './page.scheme';

const pageRouter = Router();

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

pageRouter.put(
	'/:id/:currentPage/point',
	validateData(pagePointInsertScheme),
	async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const currentPage = req.params.currentPage;
			const data: (typeof pagePointInsertScheme)['_output'] = req.body;
			const user = (await db.query.users.findMany())[0];
			const page = await createPagePoint(parseInt(currentPage), data);
			return res.json(page).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error) return res.json(error.message).status(500);
		}
	}
);

pageRouter.put(
	'/:id',
	validateData(pageInsertSchema),
	async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const user = (await db.query.users.findMany())[0];
			const data: pageInsertSchema = req.body;
			const page = await createPage(parseInt(id), data);
			return res.json(page).status(StatusCodes.OK);
		} catch (error) {
			if (error instanceof Error) return res.json(error.message).status(500);
		}
	}
);

pageRouter.get('/:id/:currentPage', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const currentPage = req.params.currentPage;
		const user = (await db.query.users.findMany())[0];
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

export { pageRouter };
