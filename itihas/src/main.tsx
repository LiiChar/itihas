import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from './Router';
import { Header } from './component/layout/header';
import { Footer } from './component/layout/footer';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './shared/const/theme/material';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header />
			<Router />
			<Footer />
		</ThemeProvider>
	</StrictMode>
);
