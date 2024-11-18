import { URL } from '../const/const';
import { Bookmark, BookmarkToHistory } from '../type/bookmark';
import { FilterParams, HistoryAll, HistoryPages } from '../type/history';
import { Layout } from '../type/layout';
import { axi } from './axios/axios';

export const getHistories = async () => {
	const histories = await axi.get<HistoryAll[]>(URL + '/history');
	return histories.data;
};

export const getHistoriesFilter = async (filter?: FilterParams) => {
	const histories = await axi.post<HistoryAll[]>(
		URL + '/history/catalog',
		filter
	);
	return histories.data;
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

export const getListBookmarks = async (userId: number) => {
	const bookmark = await axi.get<Bookmark[]>(URL + '/bookmark/list', {
		params: {
			user_id: userId,
		},
	});
	return bookmark.data;
};

export const createBookmark = async (bookmarkData: Partial<Bookmark>) => {
	const bookmark = await axi.post<Bookmark>(URL + '/bookmark', bookmarkData);
	return bookmark.data;
};

export const addHistoryToBookmark = async (
	bookmarkData: Partial<BookmarkToHistory>
) => {
	const bookmark = await axi.post<BookmarkToHistory>(
		URL + '/bookmark/history',
		bookmarkData
	);
	return bookmark.data;
};
