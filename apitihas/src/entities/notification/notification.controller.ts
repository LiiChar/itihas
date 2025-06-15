import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getNotification } from './notification.service';

const notifiactionRouter = Router();

notifiactionRouter.get('/', async (req: Request, res: Response) => {
	const userId = req.query.user_id ?? req.cookies.user.id;
	if (!userId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id not exist in request' });
	}
	const notification = await getNotification(userId);
	return res.json(notification);
});

export { notifiactionRouter };
