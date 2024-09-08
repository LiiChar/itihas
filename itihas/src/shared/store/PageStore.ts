import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ReadPage } from '../type/page';
import { preloadImage } from '../lib/image';
import { getCurrentPage } from '../api/page';

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
	return usePageStore.setState({ page });
};

export const fetchCurrentStore = async (id: number, currentPage: number) => {
	const page = await getCurrentPage(id, currentPage);
	usePageStore.setState({ page, currentPage: page.id });
	return page;
};
