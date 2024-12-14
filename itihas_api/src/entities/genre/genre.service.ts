import { db } from '../../database/db';

export const getGenres = async () => {
	const genres = await db.query.genres.findMany();

	return genres;
};
