import { z } from 'zod';

export const pageInsertSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	action: z.string(),
	image: z.string().url().nullable(),
	content: z.string(),
	sound: z.string().url().nullable(),
});

export type pageInsertSchema = (typeof pageInsertSchema)['_output'];

export const pagePointInsertScheme = z.object({
	name: z.string(),
	action: z.string(),
	script: z.string(),
});

export type pagePointInsertScheme = (typeof pagePointInsertScheme)['_output'];
