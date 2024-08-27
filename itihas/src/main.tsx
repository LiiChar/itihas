import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from './Router';
import { Layout } from './component/layout/Layout';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Layout>
			<Router />
		</Layout>
	</StrictMode>
);
