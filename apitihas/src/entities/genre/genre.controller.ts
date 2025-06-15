import { Router } from 'express';
import { createGenres, getGenres } from './genre.service';
import { validateData } from '../../middleware/validationMiddleware';
import { GenreInsertType } from '../../database/db';
import { genreInsertSchema } from './genres.scheme';
import { authificationMiddleware } from '../../middleware/authificationMiddleware';

const genreRouter = Router();

genreRouter.get('/', async (req, res) => {
	const genres = await getGenres();
	return res.json(genres);
});

genreRouter.post(
	'/',
	authificationMiddleware,
	validateData(genreInsertSchema),
	async (req, res) => {
		const data = req.body as GenreInsertType;
		const genres = await createGenres(data);
		return res.json(genres);
	}
);

export { genreRouter };
