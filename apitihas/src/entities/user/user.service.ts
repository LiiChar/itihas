import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserType, db } from '../../database/db';
import { users } from './model/user';
import { getJwtToken, getUserFromToken, sendVerifyEmail } from '../../lib/auth';
import bcrypt from 'bcrypt';
import {
	userChangeStatusScheme,
	userLoginSchema,
	userRegistrationSchema,
	userSendNotification,
	userUpdateSchema,
} from './user.scheme';
import { eq } from 'drizzle-orm';
import { emailTransporter, sendEmail } from '../../lib/mail';
import { createDefaulBookmarks } from '../../lib/default';
import { comments } from '../history/model/history';

export const loginUser = async (req: Request, res: Response) => {
	const { password, name: username }: (typeof userLoginSchema)['_output'] =
		req.body;

	const userFind = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.name, username),
	});

	if (!userFind) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ error: 'Users not found' });
	}
	const isComparePassword = await bcrypt.compare(password, userFind.password);

	if (!isComparePassword) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Password not equels', fields: ['password'] });
	}

	const token = getJwtToken(userFind);

	res.cookie('token', token, {
		maxAge: 60 * 60 * 24 * 30 * 1000,
		sameSite: 'lax',
		secure: false,
		httpOnly: true,
	});

	res.setHeader('authorization', token);

	return res.status(StatusCodes.OK).json({
		name: userFind.name,
		email: userFind.email,
		photo: userFind.photo,
		id: userFind.id,
		role: userFind.role,
	});
};

export const registerUser = async (req: Request, res: Response) => {
	const {
		password,
		name: username,
	}: (typeof userRegistrationSchema)['_output'] = req.body;
	const userFind = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.name, username),
	});

	if (userFind) {
		return res.status(StatusCodes.BAD_REQUEST).json('User exists');
	}

	const salt = await bcrypt.genSalt(6);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = (
		await db
			.insert(users)
			.values({
				name: username,
				password: hashedPassword,
			})
			.returning()
	)[0];

	const token = getJwtToken(user);

	await createDefaulBookmarks(user.id);

	res.setHeader('authorization', token);

	res.cookie('token', token, {
		maxAge: 60 * 60 * 24 * 30 * 1000,
		sameSite: 'lax',
		secure: false,
	});

	return res
		.json({
			name: user.name,
			email: user.email,
			photo: user.photo,
			id: user.id,
			role: user.role,
		})
		.status(StatusCodes.OK);
};

export const verifyEmail = async (req: Request, res: Response) => {
	const token = req.query.token as string;
	if (!token) {
		return res.status(401).json({ error: 'Не пришёл токен' });
	}
	const user = getUserFromToken(token);

	await db
		.update(users)
		.set({
			verify: true,
		})
		.where(eq(users.id, user.id));

	res.setHeader('authorization', token);

	return res.redirect(process.env.REDIRECT_URL ?? 'google.com');
};

export const updateUser = async (req: Request, res: Response) => {
	const {
		description,
		email,
		location,
		name,
		photo,
		user,
		role,
		id,
	}: (typeof userUpdateSchema)['_output'] & {
		user: UserType;
		id: number;
	} = req.body;
	if (!id) {
		return res
			.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
			.json({ error: 'Не пришёл id' });
	}
	console.log(id, user.id);

	if (Number(id) != user.id && user.role != 'admin') {
		return res
			.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
			.json({ error: 'У вам нет прав для изменения данного пользователя' });
	}

	let updateData: Record<string, any> = {
		description,
		email,
		location,
		name: name ?? undefined,
		photo: photo ?? undefined,
	};

	if (role) {
		updateData.role = role;
	}

	const userUpdated = (
		await db
			.update(users)
			.set(updateData)
			.where(eq(users.id, Number(id)))
			.returning()
	)[0];

	const token = getJwtToken(userUpdated);

	res.setHeader('authorization', token);

	return res.json({ message: 'Пользователь успешно изменён' });
};

export const removeUser = async (req: Request, res: Response) => {
	const {
		user,
	}: {
		user: UserType;
	} = req.body;
	const id = req.query.id as string;
	if (!id) {
		return res
			.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
			.json({ error: 'Не пришёл id' });
	}

	if (Number(id) != user.id || user.role != 'admin') {
		return res
			.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
			.json({ error: 'У вам нет прав для изменения данного пользователя' });
	}

	await db.delete(users).where(eq(users.id, Number(id)));

	res.removeHeader('authorization');

	return res.json({ message: 'Пользователь успешно изменён' });
};

export const getUser = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
		columns: {
			password: false,
		},
		with: {
			authorHistories: {
				with: {
					genres: {
						with: {
							genre: true,
						},
					},
				},
			},
			bookmarks: {
				with: {
					histories: {
						with: {
							history: {
								with: {
									genres: {
										with: {
											genre: true,
										},
									},
								},
							},
						},
					},
				},
			},
			characters: {
				with: {
					character: {
						with: {
							history: true,
						},
					},
				},
			},
			comments: true,
			commentsReply: true,
			commentsPage: true,
			dignity: true,
			likes: {
				with: {
					page: true,
				},
			},
		},
	});
	if (!user) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'User not exist' });
	}

	return res.json(user);
};

export const getFullUsers = async (req: Request, res: Response) => {
	const users = await db.query.users.findMany({
		columns: {
			id: true,
			name: true,
			location: true,
			email: true,
			photo: true,
			role: true,
			description: true,
			createdAt: true,
		},
	});
	return res.json(users);
};

export const getListUsers = async (req: Request, res: Response) => {
	const users = await db.query.users.findMany({
		columns: {
			id: true,
			name: true,
			photo: true,
			createdAt: true,
		},
	});
	return res.json(users);
};

export const logoutUser = (req: Request, res: Response) => {
	res.removeHeader('authorization');
	return res.json({ message: 'Успешно вышли из аккаунта' });
};

export const sendNotification = async (req: Request, res: Response) => {
	const {
		usersIdx,
		user,
		content,
	}: (typeof userSendNotification)['_output'] & {
		user: UserType;
	} = req.body;

	if (user.role != 'admin') {
		return res.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS).json({
			error: 'У вам нет прав для изменения данного пользователя',
		});
	}

	let userEmails: (string | null)[] = [];
	try {
		if (usersIdx.length > 0) {
			const promises: Promise<any>[] = [];
			usersIdx.forEach(id => {
				const prom = db.query.users.findFirst({
					where: eq(users.id, Number(id)),
					columns: {
						email: true,
					},
				});
				promises.push(prom);
			});
			userEmails = (await Promise.all<{ email: string | null }>(promises)).map(
				em => em.email
			);
		} else {
			userEmails = (
				await db.query.users.findMany({
					columns: {
						email: true,
					},
				})
			).map(em => em.email);
		}
	} catch (error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Что-то пошло не так при отправке уведомлений' });
	}

	let emails = userEmails.reduce<Promise<any>[]>((acc, el) => {
		let transport = emailTransporter();
		if (el) {
			const prom = sendEmail(el, content, transport);
			acc.push(prom);
		}
		return acc;
	}, []);

	await Promise.all(emails);

	return res.json({ message: 'Уведомления успешно отправлены пользователям' });
};

export const changeStatusUser = async (req: Request, res: Response) => {
	const {
		role,
		user,
	}: (typeof userChangeStatusScheme)['_output'] & {
		user: UserType;
	} = req.body;
	const id = req.query.id as string;
	if (!id) {
		return res
			.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
			.json({ message: 'Не пришёл id' });
	}

	if (user.role != 'admin') {
		return res.status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS).json({
			message: 'У вам нет прав для изменения статуса данного пользователя',
		});
	}

	const userUpdated = (
		await db
			.update(users)
			.set({
				role: role,
			})
			.where(eq(users.id, Number(id)))
			.returning()
	)[0];

	const token = getJwtToken(userUpdated);

	res.setHeader('authorization', token);

	return res.json({ message: 'Статус пользователя успешно изменён' });
};
