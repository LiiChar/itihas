import { create } from 'zustand';

export type ReadStoreProperty = {
	list_dialog_element: number;
};

export type ReadStore = ReadStoreProperty & {
	changeRead: (read: Partial<ReadStoreProperty>) => void;
	setRead: (read: ReadStoreProperty) => void;
};

export const useReadStore = create<ReadStore>((set, _get) => ({
	list_dialog_element: 0,
	setRead(read) {
		set(read);
	},
	changeRead(read) {
		set(store => Object.assign(read, store));
	},
}));
