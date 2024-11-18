import { create } from 'zustand';

export type Listeners = 'historyChange' | 'callback' | string;

export interface ListenerStore {
	listeners: Record<Listeners, (() => void)[]>;
	addCallback: (listener: Listeners, cb: () => void) => void;
	removeCallback: (listener: Listeners, cb: () => void) => void;
	addListener: (listener: string, cb?: (() => void)[]) => void;
	runListener: (listener: string) => void;
}

export const useListenerStore = create<ListenerStore>()((set, get) => ({
	listeners: {
		callback: [],
		historyChangeForm: [],
	},
	addCallback: (listener: Listeners, cb: () => void) => {
		set(state => {
			const storeState = state;
			if (!storeState.listeners[listener]) {
				storeState.listeners[listener] = [];
			}
			storeState.listeners[listener].push(cb);
			return { ...state };
		});
	},
	removeCallback: (listener: Listeners, cb: () => void) => {
		set(state => {
			const storeState = state;
			if (!storeState.listeners[listener]) return state;

			storeState.listeners[listener].slice(
				storeState.listeners[listener].findIndex(
					el => JSON.stringify(el) == JSON.stringify(cb)
				),
				1
			);
			state = { ...storeState };
			return state;
		});
	},
	addListener: (listener: Listeners, cb?: (() => void)[]) => {
		set(state => {
			const storeState = state;
			storeState.listeners[listener] = cb ?? [];
			state = { ...storeState };
			return state;
		});
	},
	runListener: (listener: Listeners) => {
		const state = get();
		if (!state.listeners[listener]) return;
		state.listeners[listener].forEach(cb => cb());
	},
}));
