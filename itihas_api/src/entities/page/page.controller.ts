import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../../database/db';
import { executeActionPage, getCurrentPageByHistoryId } from './page.service';

const pageRouter = Router();

pageRouter.get('/:id/:currentPage', async (req: Request, res: Response) => {
	const id = req.params.id;
	const currentPage = req.params.currentPage;
	const user = (await db.query.users.findMany())[0];
	const page = await getCurrentPageByHistoryId(
		parseInt(id),
		parseInt(currentPage),
		user
	);
	return res.json(page).status(StatusCodes.OK);
});

// pageRouter.get(
// 	'/page/:id/action/:action',
// 	async (req: Request, res: Response) => {
// 		const id = req.params.id;
// 		const action = req.params.action;
// 		const user = (await db.query.users.findMany())[0];
// 		const page = await getPagesByHistoryId(parseInt(id), user);
// 		return res.json(page).status(StatusCodes.OK);
// 	}
// );

export { pageRouter };
