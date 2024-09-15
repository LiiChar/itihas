import { z } from 'zod';

export const pageInsertSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	image: z.string().url().nullable(),
	content: z.string(),
	sound: z.string().url().nullable(),
	action: z.string().nullable(),
});

export type pageInsertSchema = (typeof pageInsertSchema)['_output'];

export const pagePointInsertScheme = z.object({
	name: z.string(),
	action: z.string(),
});

export type pagePointInsertScheme = (typeof pagePointInsertScheme)['_output'];
