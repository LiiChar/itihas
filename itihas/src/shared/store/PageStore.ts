import { create } from 'zustand';

import { ReadPage } from '../type/page';
import { getFullUrl, preloadImage } from '../lib/image';
import { getCurrentPage } from '../api/page';
import { setMedia } from './AudioStore';

export interface PageStore {
	currentPage: number;
	page: ReadPage | null;
}

export const usePageStore = create<PageStore>()(() => ({
	currentPage: 0,
	page: null,
}));

export const setCurrentPage = (currentPage: PageStore['currentPage']) => {
	return usePageStore.setState({ currentPage });
};

export const setPage = (page: NonNullable<PageStore['page']>) => {
	if (
		page.image &&
		usePageStore.getState().page &&
		usePageStore.getState().page?.image != page?.image
	) {
		preloadImage(page.image);
	}
	if (page.sound) setMedia(getFullUrl(page.sound), 'music');
	setMedia(getFullUrl(page.history.sound), 'background');
	return usePageStore.setState({ page });
};

export const fetchCurrentStore = async (id: number, currentPage: number) => {
	const page = await getCurrentPage(id, currentPage);
	setPage(page);
	usePageStore.setState({ currentPage: page.id });
	return page;
};
