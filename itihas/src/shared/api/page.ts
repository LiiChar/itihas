import { URL } from '../const/const';
import { Page, PageInsert, PagePointInsert, ReadPage } from '../type/page';
import { axi } from './axios/axios';

export const getCurrentPage = async (id: number, page: number) => {
	const pageData = await axi.get<ReadPage>(URL + '/page/' + id + '/' + page);
	return pageData.data;
};

export const resolveAction = async (actionId: number) => {
	const pageData = await axi.get<ReadPage>(URL + '/page/action/' + actionId);
	return pageData.data;
};

export const createPage = async (
	historyId: number,
	pageId: number,
	data: PageInsert
) => {
	await axi.put(`${URL}/page/${historyId}/${pageId}`, data);
};

export const createPagePoint = async (
	historyId: number,
	pageId: number,
	data: PagePointInsert
) => {
	await axi.put(`${URL}/page/${historyId}/${pageId}/point`, data);
};

export const updatePage = async (pageId: number, data: Partial<Page>) => {
	await axi.put(`${URL}/page/${pageId}`, data);
};
