import { Router } from 'express';
import { getGenres } from './genre.service';

const genreRouter = Router();

genreRouter.get('/', async (req, res) => {
	const genres = await getGenres();
	return res.json(genres);
});

export { genreRouter };
