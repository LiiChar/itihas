import { create } from 'zustand';
import { HistoryPages } from '../type/history';

export const useHistoryEditStore = create<HistoryPages | null>(() => null);

export const setHistoryEdit = (history: Partial<HistoryPages>) => {
	return useHistoryEditStore.setState(
		state => (state = Object.assign(history, state))
	);
};
