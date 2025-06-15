import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from './Router';
import { AnimatePresence } from 'framer-motion';
import { Initialize } from './component/layout/Initialize';
import { Toaster } from './shared/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<GoogleOAuthProvider
			clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
		>
			<Initialize />
			<Toaster />
			<AnimatePresence>
				<Router />
			</AnimatePresence>
		</GoogleOAuthProvider>
	</StrictMode>
);
