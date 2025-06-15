import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LOCAL_STORAGE_THEME_KEY = 'theme';

export const ChangeTheme = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');

	useEffect(() => {
		const currentTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
		if (currentTheme) {
			handleChangeTheme(currentTheme as 'light' | 'dark');
		} else {
			const media = window.matchMedia('(prefers-color-scheme: dark)');
			const theme = media.matches ? 'dark' : 'light';
			handleChangeTheme(theme);
		}
	}, []);

	const handleChangeTheme = (theme: 'light' | 'dark') => {
		if (theme == 'dark') {
			document.querySelector('body')!.classList.add('dark');
			document.querySelector('body')!.classList.remove('light');
		} else {
			document.querySelector('body')!.classList.add('light');
			document.querySelector('body')!.classList.remove('dark');
		}
		localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
		setTheme(theme);
	};

	return (
		<div className='cursor-pointer'>
			{theme == 'light' && (
				<motion.div
					transition={{ type: 'spring' }}
					initial={{ x: 20, y: -40 }}
					animate={{ x: 0, y: 0 }}
				>
					<Moon
						className='hover:stroke-primary'
						onClick={() => handleChangeTheme('dark')}
					/>
				</motion.div>
			)}
			{theme == 'dark' && (
				<motion.div
					transition={{ type: 'spring' }}
					initial={{ x: 20, y: -40 }}
					animate={{ x: 0, y: 0 }}
				>
					<Sun
						className='hover:stroke-primary'
						onClick={() => handleChangeTheme('light')}
					/>
				</motion.div>
			)}
		</div>
	);
};
