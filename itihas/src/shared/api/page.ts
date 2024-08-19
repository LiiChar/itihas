import { URL } from '../const/const';
import { ReadPage } from '../type/page';
import { axi } from './axios/axios';

export const getCurrentPage = async (id: number, page: number) => {
	const history = await axi.get<ReadPage>(URL + '/page/' + id + '/' + page);
	return history.data;
};
