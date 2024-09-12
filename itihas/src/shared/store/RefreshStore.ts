import { create } from 'zustand';

export interface RefreshStore {
	refreshs: { [key: string]: () => void };
}

export const usePageStore = create<RefreshStore>()(() => ({
	refreshs: {},
}));

export const addRefreshAction = (name: string, action: () => void) => {
	return usePageStore.setState(state => {
		state.refreshs[name] = action;
		return {
			refreshs: state.refreshs,
		};
	});
};

export const runRefreshAction = (name: string) => {
	const action = usePageStore.getState().refreshs[name];

	if (action) {
		action();
	}
};
