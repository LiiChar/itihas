import { z } from 'zod';
import { HistoryInsertType } from '../../database/db';


export const pageInsertSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	image: z.string().nullable(),
	content: z.string(),
	sound: z.string().nullable(),
	minAge: z.number().nullable(),
});

export type pageInsertSchema = (typeof pageInsertSchema)['_output'];

export const pagePointInsertScheme = z.object({
	name: z.string(),
	action: z.string(),
});

export type pagePointInsertScheme = (typeof pagePointInsertScheme)['_output'];
