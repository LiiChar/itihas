import { ReactElement, ReactNode } from 'react';
import { useLayoutStore } from '@/shared/store/LayoutStore';
import { Outlet } from 'react-router-dom';

export const Layout = ({ children }: { children?: ReactNode }) => {
	const { Footer, Header, Components, footerVisible, headerVisible } =
		useLayoutStore();
	return (
		<>
			{headerVisible && <Header />}
			<div className='w-full h-full relative '>
				{Components.map(c => {
					if (!c) {
						return;
					}

					const Component = c.Component;
					return <Component key={c.id} />;
				})}
				<Outlet />
			</div>
			{footerVisible && <Footer />}
		</>
	);
};
