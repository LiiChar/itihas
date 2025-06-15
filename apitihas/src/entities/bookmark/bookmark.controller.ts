import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	addHistoryToBookmark,
	createBookmark,
	deleteBookmarkById,
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
import { authificationMiddleware } from '../../middleware/authificationMiddleware';
const bookmarkRouter = Router();

bookmarkRouter.get('/list', async (req: Request, res: Response) => {
	const userId = req.query.user_id ?? req.cookies.user.id;
	if (!userId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id not exist in request' });
	}
	const bookmarks = await getListBookmarks(userId);

	return res.json(bookmarks);
});

bookmarkRouter.get('/', async (req: Request, res: Response) => {
	const bookmarkType = req.query.bookmark as string | undefined;
	const userId = req.query.user_id ?? req.cookies.user.id;
	if (!userId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id not exist in request' });
	}
	const bookmarks = getBookmarks(userId, bookmarkType);
	return res.json(bookmarks);
});

bookmarkRouter.post(
	'/',
	authificationMiddleware,
	validateData(bookmarkInsertSchema),
	async (req: Request, res: Response) => {
		const data = req.body as bookmarkInsertSchemaType;

		const bookmark = await createBookmark(data);
		return res.json(bookmark);
	}
);

bookmarkRouter.delete(
	'/:id',
	authificationMiddleware,
	async (req: Request, res: Response) => {
		const bookmarkId = req.params.id;

		if (!bookmarkId) {
			return res.status(402).json({ error: 'Bookmark is require' });
		}

		await deleteBookmarkById(+bookmarkId);
		return res.json({ message: 'Succeessfule delete bookmark' });
	}
);

bookmarkRouter.post(
	'/history',
	authificationMiddleware,
	validateData(bookmarkHistoryInsertSchema),
	async (req: Request, res: Response) => {
		const data = req.body as bookmarkHistoryInsertSchemaType;
		const bookmark = await addHistoryToBookmark(data);
		return res.json(bookmark);
	}
);

bookmarkRouter.delete(
	'/',
	authificationMiddleware,
	async (req: Request, res: Response) => {}
);

export { bookmarkRouter };
