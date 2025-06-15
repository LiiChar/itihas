import { z } from 'zod';
import { ReplyCommentInsertType } from '../../database/db';

export const commentInsertSchema = z.object({
	userId: z.number(),
	historyId: z.number(),
	content: z.string(),
});

export type commentInsertSchema = (typeof commentInsertSchema)['_output'];

export const replyInsertSchema = z.object({
	userId: z.number(),
	commentId: z.number(),
	content: z.string(),
});

export type replyInsertSchema = (typeof replyInsertSchema)['_output'];
