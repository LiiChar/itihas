import { create, createStore } from 'zustand';
import { History } from '../type/history';

export interface HistoryStore {
	histories: History[];
	history: History | null;
}

const useHistoryStore = create<HistoryStore>(() => ({
	histories: [],
	history: null,
}));

export const setHistory = (history: HistoryStore['history']) => {
	return useHistoryStore.setState({ history });
};

export const setHistories = (histories: HistoryStore['histories']) => {
	return useHistoryStore.setState({ histories });
};
