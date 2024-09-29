import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { useMount, useUnmount } from '@siberiacancode/reactuse';

import { Separator } from '@/shared/ui/separator';
import { Background } from '@/component/pages/auth/Background';
import { RegisterForm } from '@/component/pages/auth/RegisterForm';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

export const Register = () => {
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
				animate={{ x: 0, opacity: 1 }}
				initial={{ x: 500, opacity: 0 }}
				exit={{ x: 200 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-[clamp(300px,40%,600px)] z-[70] h-full bg-secondary px-4 py-2'
			>
				<h2 className='text-lg'>Зарегестрироваться на Itihas</h2>
				<Separator orientation='horizontal' className='bg-foreground' />
				<RegisterForm />
				<div>
					Если у вас есть аккаунта
					<Link to={'/auth/login'} className='text-primary hover:underline'>
						{' '}
						войдите
					</Link>
				</div>
			</motion.div>
			<motion.div
				animate={{ x: 0 }}
				initial={{ x: -200 }}
				exit={{ x: -200 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-full h-full'
			>
				<Background text={['Добро пожаловать', 'в ваше новое путешествие']} />
			</motion.div>
		</div>
	);
};
