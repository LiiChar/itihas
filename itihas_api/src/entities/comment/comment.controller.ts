import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommentInsertType, db } from '../../database/db';
import { createComment, createReplyComment } from './comment.service';
import { validateData } from '../../middleware/validationMiddleware';
import { commentInsertSchema, replyInsertSchema } from './comment.scheme';
import { comments } from '../history/model/history';
import { eq } from 'drizzle-orm';

const commentRouter = Router();

commentRouter.post(
	'/',
	validateData(commentInsertSchema),
	async (req: Request, res: Response) => {
		const commentData: CommentInsertType = req.body;
		const user = (await db.query.users.findMany())[0];
		if (!(user.id == commentData.userId || user.role == 'admin')) {
			return res.json().status(StatusCodes.UNAUTHORIZED);
		}
		const comment = await createComment(commentData);
		return res.json(comment).status(StatusCodes.OK);
	}
);

commentRouter.post(
	'/reply',
	validateData(replyInsertSchema),
	async (req: Request, res: Response) => {
		const commentReplyData: replyInsertSchema = req.body;
		const user = (await db.query.users.findMany())[0];
		if (!(user.id == commentReplyData.userId || user.role == 'admin')) {
			return res
				.json('Dont allow to create comment')
				.status(StatusCodes.UNAUTHORIZED);
		}
		const comment = await db.query.comments.findFirst({
			where: eq(comments.id, commentReplyData.commentId),
		});
		if (!comment) {
			return res.json('Comment not exist').status(StatusCodes.BAD_REQUEST);
		}
		const commentReply = await createReplyComment(commentReplyData);
		return res.json(commentReply).status(StatusCodes.OK);
	}
);

export { commentRouter };
