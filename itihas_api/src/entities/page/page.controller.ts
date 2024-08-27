import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../../database/db';
import { executeActionPage, getCurrentPageByHistoryId } from './page.service';

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
