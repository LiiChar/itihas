import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from './Router';
import { AnimatePresence } from 'framer-motion';
import { Initialize } from './component/layout/Initialize';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Initialize />
		<AnimatePresence>
			<Router />
		</AnimatePresence>
	</StrictMode>
);
