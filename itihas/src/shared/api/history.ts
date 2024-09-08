import { URL } from '../const/const';
import { HistoryAll, HistoryPages } from '../type/history';
import { axi } from './axios/axios';

export const getHistories = async () => {
	const histories = await axi.get<HistoryAll[]>(URL + '/history');
	return histories;
};

export const getHistory = async (id: number) => {
	const history = await axi.get<HistoryPages>(URL + '/history/' + id);
	return history.data;
};
