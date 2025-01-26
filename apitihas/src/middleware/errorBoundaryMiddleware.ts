import { Request, Response, NextFunction } from 'express';
import { ErrorBoundary } from '../lib/error';
import { StatusCodes } from 'http-status-codes';

export const errorBoundaryMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		next();
	} catch (e) {
		if (e instanceof ErrorBoundary) {
			return e.ErrorResponse(res);
		}
		if (e instanceof Error) {
			return res
				.json('Server failed send responce')
				.status(StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
};
