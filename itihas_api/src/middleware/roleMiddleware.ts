import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserType } from '../database/db';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtData } from '../types/user';

export const roleMiddleware = (role: UserType['role']) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const auth = req.headers.authorization;
			if (!auth) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ error: 'Internal Server Error' });
			}
			const [bearer, token] = auth.split(' ');
			const secret = process.env.JWT_SECRET!;
			const decoded = jwt.verify(token, secret, {});
			if (typeof decoded == 'string') {
				const user: jwtData = JSON.parse(decoded);
				if (user.role == role) {
					next();
				} else {
					return res
						.status(StatusCodes.UNAUTHORIZED)
						.json({ error: 'Internal Server Error' });
				}
			} else {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ error: 'Internal Server Error' });
			}
		} catch (e) {
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ error: 'Internal Server Error' });
		}
	};
};
