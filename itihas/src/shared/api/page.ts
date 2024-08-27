import { URL } from '../const/const';
import { ReadPage } from '../type/page';
import { axi } from './axios/axios';

export const getCurrentPage = async (id: number, page: number) => {
	const pageData = await axi.get<ReadPage>(URL + '/page/' + id + '/' + page);
	return pageData.data;
};

export const resolveAction = async (actionId: number) => {
	const pageData = await axi.get<ReadPage>(URL + '/page/action/' + actionId);
	return pageData.data;
};
