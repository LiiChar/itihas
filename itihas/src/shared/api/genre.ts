import { URL } from '../const/const';
import { Genre } from '../type/history';
import { axi } from './axios/axios';

const BASE_URL = URL + '/genre';

export const getGenres = async () => {
	const genres = await axi.get<Genre[]>(BASE_URL);
	return genres.data;
};
