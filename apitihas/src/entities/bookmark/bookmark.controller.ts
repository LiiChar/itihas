import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	addHistoryToBookmark,
	createBookmark,
	getBookmarks,
	getListBookmarks,
} from './bookmark.service';
import {
	bookmarkHistoryInsertSchema,
	bookmarkHistoryInsertSchemaType,
	bookmarkInsertSchema,
	bookmarkInsertSchemaType,
} from './bookmark.scheme';
import { validateData } from '../../middleware/validationMiddleware';
const bookmarkRouter = Router();

bookmarkRouter.get('/list', async (req: Request, res: Response) => {
	const userId = req.query.user_id ?? req.cookies.user.id;
	if (!userId) {
		return res.json('Id not exist in request').status(StatusCodes.BAD_REQUEST);
	}
	const bookmarks = await getListBookmarks(userId);

	return res.json(bookmarks);
});

bookmarkRouter.get('/', async (req: Request, res: Response) => {
	const bookmarkType = req.query.bookmark as string | undefined;
	const userId = req.query.user_id ?? req.cookies.user.id;
	if (!userId) {
		return res.json('Id not exist in request').status(StatusCodes.BAD_REQUEST);
	}
	const bookmarks = getBookmarks(userId, bookmarkType);
	return res.json(bookmarks);
});

bookmarkRouter.post(
	'/',
	validateData(bookmarkInsertSchema),
	async (req: Request, res: Response) => {
		const data = req.body as bookmarkInsertSchemaType;

		const bookmark = await createBookmark(data);
		return res.json(bookmark);
	}
);
bookmarkRouter.post(
	'/history',
	validateData(bookmarkHistoryInsertSchema),
	async (req: Request, res: Response) => {
		const data = req.body as bookmarkHistoryInsertSchemaType;
		const bookmark = await addHistoryToBookmark(data);
		return res.json(bookmark);
	}
);

bookmarkRouter.delete('/', async (req: Request, res: Response) => {});

export { bookmarkRouter };
