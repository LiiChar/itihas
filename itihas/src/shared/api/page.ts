import { URL } from '../const/const';
import { useUserStore } from '../store/UserStore';
import { HistoryPage } from '../type/history';
import { Layout } from '../type/layout';
import { FilterParamsPage } from '../type/like';
import {
	Page,
	PageInsert,
	PagePointInsert,
	PageWithHistory,
	ReadPage,
} from '../type/page';
import { axi } from './axios/axios';

export const getCurrentPage = async (id: number, page: number) => {
	const pageData = await axi.get<ReadPage>(
		URL +
			'/page/' +
			id +
			'/' +
			page +
			`?userId=${useUserStore.getState().user?.id}`
	);
	return pageData.data;
};

export const runCode = async (data: {
	code: string;
	historyId: number;
	userId: number;
}) => {
	const req = await axi.post<{ pageId: number; message: string }>(
		URL + '/page/code',
		data
	);
	return req.data.pageId;
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

export const getPagesList = async (historyId?: number) => {
	const pages = await axi.get<PageWithHistory>(`${URL}/page/list`, {
		params: {
			historyId,
		},
	});

	if (!Array.isArray(pages.data)) return [];
	return pages.data;
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

export const getPages = async (filter: FilterParamsPage) => {
	const pages = await axi.post<PageWithHistory[]>(`${URL}/page/filter`, filter);
	return pages.data;
};

export const getPage = async (id: number) => {
	const page = await axi.get<ReadPage>(`${URL}/page/${id}`);
	return page.data;
};

export const updatePageLayouts = async (
	layout: Partial<Layout> & { id: number },
	pageId: number
) => {
	const layouts = await axi.put<Layout>(URL + '/page/layout/' + pageId, layout);
	return layouts.data;
};
