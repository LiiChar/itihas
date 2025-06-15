import { URL } from '../const/const';
import { Bookmark, BookmarkToHistory } from '../type/bookmark';
import {
	FilterParams,
	History,
	HistoryAll,
	HistoryPages,
	ProgreseHistory,
} from '../type/history';
import { Layout } from '../type/layout';
import { SimilarType, SimilarWithHistory } from '../type/similar';
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
	if (!Array.isArray(histories.data)) return [];
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

export const updateHistoryLayouts = async (
	layout: Partial<Layout> & { id: number }
) => {
	const layouts = await axi.put<Layout>(URL + '/history/layout', layout);
	return layouts.data;
};

export const updateHistory = async (id: number, data: History) => {
	const newHistory = await axi.put<HistoryPages>(URL + '/history/' + id, data);
	return newHistory;
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

export const deleteBookmark = async (bookmarkId: number) => {
	await axi.delete<Bookmark>(URL + '/bookmark/' + bookmarkId);
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

export const addSimilarHistory = async (similarData: SimilarType) => {
	const similar = await axi.post<SimilarType>(
		URL + '/history/similar',
		similarData
	);
	return similar;
};

export const updateSimilarHistoryRate = async (similarData: {
	similarId: number;
	rate: number;
}) => {
	const similar = await axi.put<SimilarType>(
		URL + '/history/similar/rate',
		similarData
	);
	return similar;
};

export const getProgressHistory = async ({
	historyId,
	pageId,
	userId,
}: {
	historyId?: number;
	userId?: number;
	pageId?: number;
}) => {
	const progreses = await axi.get<ProgreseHistory[]>(URL + '/progress', {
		params: { historyId, pageId, userId },
	});

	return progreses.data;
};

export const getSimilarHistory = async (historyId: number) => {
	const similar = await axi.get<SimilarWithHistory>(
		URL + `/history/${historyId}/similar`
	);
	return similar;
};
