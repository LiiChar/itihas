import { db, GenreInsertType } from '../../database/db';
import { genres } from '../history/model/history';

export const getGenres = async () => {
	const genres = await db.query.genres.findMany();

	return genres;
};

export const createGenres = async (genreData: GenreInsertType) => {
	const genre = await db.insert(genres).values(genreData).returning();

	return genre[0];
};
