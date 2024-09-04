import { create } from 'zustand';
import { Header } from '@/component/layout/header';
import { Footer } from '@/component/layout/footer';

export interface LayoutStore {
	headerVisible: boolean;
	footerVisible: boolean;
	Header: () => JSX.Element;
	Footer: () => JSX.Element;
	Components: ({ id: number; Component: () => JSX.Element } | null)[];
}

export const useLayoutStore = create<LayoutStore>(() => ({
	Header: Header,
	Footer: Footer,
	footerVisible: true,
	headerVisible: true,
	Components: [],
}));

export const setHeader = (Header: LayoutStore['Header']) => {
	return useLayoutStore.setState({ Header });
};

export const setVisibleHeader = (visible: boolean) => {
	useLayoutStore.setState({ headerVisible: visible });
};

export const setVisibleFooter = (visible: boolean) => {
	useLayoutStore.setState({ footerVisible: visible });
};

export const toggleVisisbleHeader = () => {
	useLayoutStore.setState(store => ({
		headerVisible: !store.headerVisible,
	}));
};

export const setFooter = (Footer: LayoutStore['Footer']) => {
	return useLayoutStore.setState({ Footer });
};

export const addComponent = (id: number, Component: () => JSX.Element) => {
	if (useLayoutStore.getState().Components[id]) {
		return;
	}

	useLayoutStore.getState().Components[id] = { id, Component };
};

export const removeComponent = (id: number, _Component: () => JSX.Element) => {
	const indexFinded = useLayoutStore.getState().Components[id];
	if (!indexFinded) {
		return;
	}

	useLayoutStore.getState().Components[id] = null;
};

export const toggleComponent = (id: number, component: () => JSX.Element) => {
	const isVisible = false;
	const toggle = () => {
		if (isVisible) {
			removeComponent(id, component);
		} else {
			addComponent(id, component);
		}
	};

	return toggle;
};
