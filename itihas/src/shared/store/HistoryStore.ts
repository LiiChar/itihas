import { create } from 'zustand';
import { HistoryPages } from '../type/history';

export interface HistoryStore {
	history: HistoryPages | null;
}

export const useHistoryStore = create<HistoryStore>(() => ({
	history: null,
}));

export const setHistory = (history: HistoryStore['history']) => {
	return useHistoryStore.setState({ history });
};
