import { useEffect } from 'react';
import {
	addComponent,
	removeComponent,
	setFooter,
	setHeader,
	setVisibleFooter,
	setVisibleHeader,
	useLayoutStore,
} from '../store/LayoutStore';

type UseLayoutProps = {
	header?: boolean;
	footer?: boolean;
	Header?: () => JSX.Element;
	Footer?: () => JSX.Element;
	components?: { id: number; component: () => JSX.Element }[];
	option?: {
		hiddenElements?: number[];
		always?: boolean;
	};
};

export const useLayout = ({
	footer,
	header,
	option,
	Footer,
	Header,
	components,
}: UseLayoutProps) => {
	const {
		footerVisible,
		headerVisible,
		Footer: F,
		Header: H,
	} = useLayoutStore();
	useEffect(() => {
		const prevHeader = H;
		const prevFooter = F;
		setVisibleHeader(header ?? headerVisible);
		setVisibleFooter(footer ?? footerVisible);
		if (Header) {
			setHeader(Header);
		}
		if (Footer) {
			setFooter(Footer);
		}
		components?.forEach(el => {
			addComponent(el.id, el.component);
		});
		return () => {
			if (footer != undefined && option?.always == true) {
				setVisibleFooter(footerVisible);
			}
			if (footer != undefined && option?.always == true) {
				setVisibleHeader(headerVisible);
			}
			if (Header) {
				setHeader(prevHeader);
			}
			if (Footer) {
				setFooter(prevFooter);
			}
			components?.forEach(el => {
				removeComponent(el.id);
			});
		};
	}, []);
};
