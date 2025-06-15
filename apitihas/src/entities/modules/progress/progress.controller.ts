import { Router } from 'express';
import { getProgress } from './progress.service';

const progressRouter = Router();

progressRouter.get('/', async (req, res) => {
	const userId = req.query.user_id ? +req.query.user_id! : undefined;
	const historyId = req.query.history_id ? +req.query.history_id! : undefined;
	const pageId = req.query.page_id ? +req.query.page_id! : undefined;

	const progress = await getProgress({ historyId, pageId, userId });

	return res.json(progress);
});

export { progressRouter };
