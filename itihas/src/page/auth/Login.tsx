import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { useMount, useUnmount } from '@siberiacancode/reactuse';

import { Separator } from '@/shared/ui/separator';
import { LoginForm } from '@/component/pages/auth/LoginForm';
import { Background } from '@/component/pages/auth/Background';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Login = () => {
	useMount(() => {
		setVisibleHeader(false);
		setVisibleFooter(false);
	});
	useUnmount(() => {
		setVisibleHeader(true);
		setVisibleFooter(true);
	});
	return (
		<div className='flex h-screen'>
			<motion.div
				animate={{ x: 0 }}
				initial={{ x: 200 }}
				exit={{ x: 200 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-full h-full'
			>
				<Background text={['Добро пожаловать', 'в ваше новое путешествие']} />
			</motion.div>
			<motion.div
				animate={{ x: 0, opacity: 1 }}
				initial={{ x: -500, opacity: 0 }}
				exit={{ x: -500 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-[clamp(300px,30%,600px)] z-[70] h-full bg-secondary px-4 py-2'
			>
				<h2 className='text-lg'>Войти на Itihas</h2>
				<Separator orientation='horizontal' className='bg-foreground' />
				<LoginForm />
				<div>
					Если у вас нет аккаунта
					<Link to={'/auth/register'} className='text-primary hover:underline'>
						{' '}
						зарегестрируйтесь
					</Link>
				</div>
			</motion.div>
		</div>
	);
};
