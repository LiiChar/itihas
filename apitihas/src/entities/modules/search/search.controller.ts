import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { search } from './search.service';

const searchRouter = Router();

searchRouter.get('/search', async (req: Request, res: Response) => {
	const searchParam = req.query.search;
	if (!searchParam) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Not found by string: ' + searchParam });
	}
	const searchedValues = await search(searchParam as string);
	return res.json(searchedValues);
});

export { searchRouter };
