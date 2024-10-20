import { URL } from '../const/const';
import { HistoryAll, HistoryPages } from '../type/history';
import { Layout } from '../type/layout';
import { axi } from './axios/axios';

export const getHistories = async () => {
	const histories = await axi.get<HistoryAll[]>(URL + '/history');
	return histories;
};

export const getHistory = async (id: number) => {
	const history = await axi.get<HistoryPages>(URL + '/history/' + id);
	return history.data;
};

export const getLayouts = async () => {
	const layouts = await axi.get<Layout[]>(URL + '/history/layout');
	return layouts.data;
};

export const createHistory = async (historyData: Partial<HistoryPages>) => {
	const history = await axi.post<HistoryPages>(URL + '/history', historyData);
	return history.data;
};
