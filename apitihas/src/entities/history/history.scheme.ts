import { z } from 'zod';
import { HistoryInsertType } from '../../database/db';

export const historyInsertSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	image: z.string().nullable(),
	content: z.string(),
	sound: z.string().nullable(),
	minAge: z.number().nullable(),
	genres: z.array(z.number()).nullable(),
});
export type HistoryInsertSchema = (typeof historyInsertSchema)['_output'];

export const historyPointInsertScheme = z.object({
	name: z.string(),
	action: z.string(),
});

export type HistoryPointInsertScheme =
	(typeof historyPointInsertScheme)['_output'];
