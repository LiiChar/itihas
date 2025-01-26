import { jwtData } from '../types/user';
import jwt from 'jsonwebtoken';
import { emailTransporter } from './mail';
import { UserType } from '../database/db';
import { response } from 'express';

export const getJwtToken = (user: jwtData): string => {
	const token = jwt.sign(user, process.env.JWT_SECRET ?? 'itihas');
	return token;
};

export function getPayloadByToken<T>(token: string): T {
	const secret = process.env.JWT_SECRET!;
	const payload = jwt.verify(token, secret) as T;
	return payload;
}

export const getUserFromToken = (token: string): UserType => {
	const user = jwt.decode(token) as UserType;
	return user;
};

export const sendVerifyEmail = async (email: string, token: string) => {
	const verificationUrl = `${process.env.BASE_URL}/user/verify?token=${token}`;
	const mailOptions = {
		from: process.env.MAILER_USER,
		to: email,
		subject: 'Подтвердите свою почту',
		text: '',
		html: `Пожалуйста нажмине на ссылку: <a href="${verificationUrl}">Подтвердите свою почту</a>`,
	};
	try {
		await emailTransporter().sendMail(mailOptions);
	} catch (error) {
		if (
			error &&
			typeof error == 'object' &&
			'response' in error &&
			typeof error.response == 'string'
		) {
			throw new Error(error.response);
		}
	}
};
