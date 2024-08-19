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
		const auth = req.headers.authorization;
		if (!auth) {
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
