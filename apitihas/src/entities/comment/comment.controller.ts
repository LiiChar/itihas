import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommentInsertType, db } from '../../database/db';
import {
	createComment,
	createReplyComment,
	getReplyComments,
} from './comment.service';
import { validateData } from '../../middleware/validationMiddleware';
import { commentInsertSchema, replyInsertSchema } from './comment.scheme';
import { comments } from '../history/model/history';
import { eq } from 'drizzle-orm';
import { authificationMiddleware } from '../../middleware/authificationMiddleware';

const commentRouter = Router();

commentRouter.post(
	'/',
	authificationMiddleware,
	validateData(commentInsertSchema),
	async (req: Request, res: Response) => {
		const commentData: CommentInsertType = req.body;
		const comment = await createComment(commentData);
		return res.json(comment);
	}
);

commentRouter.get('/reply/:id', async (req: Request, res: Response) => {
	const commentId = req.params.id;

	if (!commentId)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Params not in request' });
	const replyComment = await getReplyComments(+commentId);
	return res.json(replyComment);
});

commentRouter.post(
	'/reply',
	authificationMiddleware,
	validateData(replyInsertSchema),
	async (req: Request, res: Response) => {
		const commentReplyData: replyInsertSchema = req.body;
		const user = req.body.user;
		const historyId = req.query.historyId as unknown as number;
		const comment = await db.query.comments.findFirst({
			where: eq(comments.id, commentReplyData.commentId),
		});
		if (!comment) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Comment not exist' });
		}
		const commentReply = await createReplyComment(commentReplyData, historyId);
		return res.json(commentReply).status(StatusCodes.OK);
	}
);

export { commentRouter };
