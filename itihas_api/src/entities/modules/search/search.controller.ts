import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { search } from './search.service';

const searchRouter = Router();

searchRouter.get('/search', async (req: Request, res: Response) => {
	const searchParam = req.query.search;
	if (!searchParam) {
		return res.json().status(StatusCodes.BAD_REQUEST);
	}
	const searchedValues = await search(searchParam as string);
	return res.json(searchedValues).status(StatusCodes.OK);
});

export { searchRouter };
