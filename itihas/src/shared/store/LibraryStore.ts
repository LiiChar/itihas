import { create } from 'zustand';
import { FilterParams, HistoryAll } from '../type/history';
import { getHistoriesFilter } from '../api/history';

type LibraryStore = {
	countHistory: number;
	currentPage: number;
	querySizeHistory: number;
	isScrolling: boolean;
	ordering: 'asc' | 'desc';
	options: FilterParams;
	histories: HistoryAll[];
};

type LibraryStoreAction = {
	setHistories: (histories: LibraryStore['histories']) => void;
	setCountHistory: (count: LibraryStore['countHistory']) => void;
	setCurrentPage: (page: LibraryStore['currentPage']) => void;
	setQuerySizeHistory: (size: LibraryStore['querySizeHistory']) => void;
	setOptions: (options: LibraryStore['options']) => void;
	updateLibraryHistories: () => void;
	setOrdering: (order: LibraryStore['ordering']) => void;
};

const defaultLibrartStore = {
	countHistory: 0,
	currentPage: 0,
	histories: [],
	ordering: 'desc',

	isScrolling: true,
	querySizeHistory: 30,
	options: {
		limit: 30,
		offset: 0,
		page: 0,
	},
};

export const useLibraryStore = create<LibraryStore & LibraryStoreAction>(
	(set, get) => ({
		countHistory: 0,
		currentPage: 0,
		ordering: 'desc',
		histories: [],
		isScrolling: true,
		querySizeHistory: 30,
		options: {
			limit: 30,
			offset: 0,
			page: 0,
		},
		setCountHistory(count) {
			set(state => {
				state.countHistory = count;
				return state;
			});
		},
		setCurrentPage(page) {
			set(state => {
				if (state.currentPage * state.querySizeHistory > state.countHistory)
					return state;
				state.currentPage = page;
				state.options.page = page;
				state.options.offset = page * state.querySizeHistory;
				return { ...state };
			});
			const state = get();
			if (state.currentPage * state.querySizeHistory > state.countHistory)
				return;
			get().updateLibraryHistories();
		},
		setHistories(histories) {
			set(state => ({
				histories: state.isScrolling
					? [...state.histories, ...histories]
					: histories,
			}));
		},
		setOrdering(order) {
			console.log(order);

			set(state => {
				state.ordering = order;
				state.options = Object.assign(state.options, {
					orders: state.options.orders?.map(o => {
						o.order = order;
						return o;
					}),
				});
				return {
					...state,
				};
			});

			get().setOptions({});
		},
		setOptions(options) {
			set(state => {
				const newOptions = Object.assign(state.options, options);
				state.options = newOptions;
				state.currentPage = defaultLibrartStore.currentPage;
				state.options.offset =
					newOptions.offset ?? defaultLibrartStore.options.offset;
				state.options.page =
					newOptions.page ?? defaultLibrartStore.options.page;
				return { ...Object.assign(state, defaultLibrartStore) };
			});
			get().updateLibraryHistories();
		},
		setQuerySizeHistory(size) {
			set(state => ({
				querySizeHistory: size,
				options: Object.assign(state.options, { limit: size }),
			}));
			get().updateLibraryHistories();
		},
		updateLibraryHistories() {
			set(state => {
				console.log(state.options);

				getHistoriesFilter(state.options).then(data => {
					state.setHistories(data);
				});
				return { ...state };
			});
		},
	})
);

export const updateLibraryHistories = () => {
	const state = useLibraryStore.getState();

	getHistoriesFilter(state.options).then(data => {
		state.setHistories(data);
	});
};
