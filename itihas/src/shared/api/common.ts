import { URL } from '../const/const';
import { SearchResult } from '../type/common';
import { axi } from './axios/axios';

export const searchByString = async (
	search: string,
	controller?: AbortController
): Promise<SearchResult> => {
	const axio: any = axi;
	const searched: any = await axio.get(URL + '/search' + '?search=' + search, {
		signal: controller?.signal,
	});
	return searched.data;
};
