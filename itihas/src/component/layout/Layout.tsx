import { ReactElement } from 'react';
import { useLayoutStore } from '@/shared/store/LayoutStore';

export const Layout = ({ children }: { children: ReactElement }) => {
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
					console.log(c.id);

					const Component = c.Component;
					return <Component key={c.id} />;
				})}
				{children}
			</div>
			{footerVisible && <Footer />}
		</>
	);
};
