import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { jwtData } from '../types/user';

export const authificationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let auth = req.headers.authorization;

		const cookiesAuth = req.cookies['token'] as string;
		if (!auth && !cookiesAuth) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ error: 'Internal Server Error' });
		} else if (cookiesAuth) {
			auth = cookiesAuth;
		} else {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ error: 'Internal Server Error' });
		}
		const [_bearer, token] = auth.split(' ');
		const secret = process.env.JWT_SECRET!;
		const decoded = jwt.verify(token, secret, {});
		if (typeof decoded == 'string') {
			const user: jwtData = JSON.parse(decoded);
			req.body.user = user;
		} else {
			req.body.user = decoded;
		}
		next();
	} catch (e) {
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal Server Error' });
	}
};
