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
	setHistories: (histories: HistoryAll[]) => void;
	setCountHistory: (count: number) => void;
	setCurrentPage: (page: number) => void;
	setQuerySizeHistory: (size: number) => void;
	setOptions: (options: Partial<FilterParams>) => void;
	updateLibraryHistories: () => void;
	setOrdering: (order: 'asc' | 'desc') => void;
	setIsScrolling: (value: boolean) => void;
};

const defaultLibraryStore: LibraryStore = {
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
};

export const useLibraryStore = create<LibraryStore & LibraryStoreAction>(
	(set, get) => ({
		...defaultLibraryStore,

		setCountHistory: count => {
			set({ countHistory: count });
		},

		setCurrentPage: page => {
			const { querySizeHistory, countHistory } = get();
			if (page * querySizeHistory >= countHistory) return;

			set(state => ({
				currentPage: page,
				options: {
					...state.options,
					page,
					offset: page * state.querySizeHistory,
				},
			}));

			get().updateLibraryHistories();
		},

		setHistories: histories => {
			set(state => ({
				histories: state.isScrolling
					? [...state.histories, ...histories]
					: histories,
			}));
		},

		setOrdering: order => {
			const { options } = get();
			const updatedOrders = (options.orders || []).map(o => ({ ...o, order }));
			set(state => ({
				ordering: order,
				options: {
					...state.options,
					orders: updatedOrders,
				},
			}));

			get().updateLibraryHistories();
		},

		setOptions: options => {
			const merged = {
				...defaultLibraryStore.options,
				...get().options,
				...options,
			};
			set({
				currentPage: defaultLibraryStore.currentPage,
				options: merged,
			});
			get().updateLibraryHistories();
		},

		setQuerySizeHistory: size => {
			set(state => ({
				querySizeHistory: size,
				options: {
					...state.options,
					limit: size,
				},
			}));

			get().updateLibraryHistories();
		},

		updateLibraryHistories: async () => {
			const { options, setHistories } = get();
			const data = await getHistoriesFilter(options);
			setHistories(data);
		},
		setIsScrolling(value) {
			set({ isScrolling: value });
		},
	})
);

// 💡 Для вызова извне (например, вне компонента)
export const updateLibraryHistories = () => {
	const { options, setHistories } = useLibraryStore.getState();
	getHistoriesFilter(options).then(data => {
		setHistories(data);
	});
};

export const setDefaultLibraryHistory = () => {
	useLibraryStore.setState(defaultLibraryStore);
	updateLibraryHistories();
};
