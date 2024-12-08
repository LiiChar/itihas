import { z } from 'zod';

export const pageInsertSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	image: z.string().nullable(),
	content: z.string(),
	sound: z.string().nullable(),
	action: z.string().nullable(),
});

export type pageInsertSchema = (typeof pageInsertSchema)['_output'];

export const pagePointInsertScheme = z.object({
	name: z.string(),
	action: z.string(),
});

export type pagePointInsertScheme = (typeof pagePointInsertScheme)['_output'];

export const pagePointUpdateScheme = z
	.object({
		name: z.string().nullable(),
		action: z.string().nullable(),
	})
	.partial();

export type pagePointUpdateScheme = (typeof pagePointUpdateScheme)['_output'];

export const runCodeScheme = z.object({
	code: z.string(),
	userId: z.number(),
	historyId: z.number(),
});

export type runCodeScheme = (typeof runCodeScheme)['_output'];
