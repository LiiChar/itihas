import React, { ReactElement } from 'react';
import { Header } from './header';
import { Footer } from './footer';

export const Layout = ({ children }: { children: ReactElement }) => {
	return (
		<div>
			<Header />
			{children}
			<Footer />
		</div>
	);
};
