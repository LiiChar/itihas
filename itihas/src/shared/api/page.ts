import { URL } from '../const/const';
import { HistoryPage } from '../type/history';
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

export const deleteActionPage = async (actionId: number) => {
	const pageData = await axi.delete<ReadPage>(URL + '/page/action/' + actionId);
	return pageData;
};

export const updateActionPage = async (
	actionId: number,
	action: Partial<PagePointInsert>
) => {
	const pageData = await axi.put<ReadPage>(URL + '/page/action/' + actionId, {
		...action,
	});
	return pageData;
};

export const createPage = async (id: number, data: PageInsert) => {
	const page = await axi.post<HistoryPage>(`${URL}/page/${id}`, data);
	return page;
};

export const createPagePoint = async (
	pageId: number,
	data: PagePointInsert
) => {
	await axi.post(`${URL}/page/${pageId}/point`, data);
};

export const updatePage = async (pageId: number, data: Partial<Page>) => {
	await axi.put(`${URL}/page/${pageId}`, data);
};
