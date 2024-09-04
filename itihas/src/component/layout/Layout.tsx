import { ReactElement } from 'react';
import { useLayoutStore } from '@/shared/store/LayoutStore';

export const Layout = ({ children }: { children: ReactElement }) => {
	const { Footer, Header, Components, footerVisible, headerVisible } =
		useLayoutStore();
	return (
		<>
			{headerVisible && <Header />}
			{children}
			{footerVisible && <Footer />}
			{Components.map(c => {
				if (!c) {
					return;
				}
				const Component = c.Component;
				return <Component key={c.id} />;
			})}
		</>
	);
};
