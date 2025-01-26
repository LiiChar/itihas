import { z } from 'zod';

export const userRegistrationSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8),
});

export const userLoginSchema = z.object({
	name: z.string(),
	password: z.string().min(8),
});

export const userUpdateSchema = z.object({
	description: z.string().nullable(),
	email: z.string().email().nullable(),
	location: z.string().nullable(),
	name: z.string().nullable(),
	photo: z.string().nullable(),
});

export const userChangeStatusScheme = z.object({
	role: z.enum(['user', 'admin']),
});

export const userSendNotification = z.object({
	usersIdx: z.array(z.number()),
	content: z.string(),
});
