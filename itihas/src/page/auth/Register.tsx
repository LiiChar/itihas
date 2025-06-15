import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { useMount, useUnmount } from '@siberiacancode/reactuse';

import { Separator } from '@/shared/ui/separator';
import { Background } from '@/component/pages/auth/Background';
import { RegisterForm } from '@/component/pages/auth/RegisterForm';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';

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
		<div className='flex h-screen overflow-hidden'>
			<motion.div
				animate={{ x: 0 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-full h-full'
			>
				<Background text={['Добро пожаловать', 'в ваше новое путешествие']} />
			</motion.div>
			<motion.div
				animate={{ x: 0, opacity: 1 }}
				initial={{ x: -200 }}
				exit={{ x: -200 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-[clamp(400px,40%,600px)] relative min-w-[400px] z-[70] h-full bg-secondary px-4 py-2'
			>
				<h2 className='text-lg'>Зарегестрироваться на Itihas</h2>
				<Separator orientation='horizontal' className='bg-foreground mb-4' />
				<RegisterForm />
				<Link
					to={'/auth/login'}
					className='text-primary hover:underline absolute bottom-2 left-2'
				>
					<span className='flex rotate-180 -mr-1 relative after:content-[""] after:absolute  after:border-b-[2px] after:w-4 after:top-[calc(50%-0.8px)] hover:after:w-8 hover:after:-ml-4 after:transition-all transition-all text-foreground	 after:rotate-180 after:-left-1 duration-300'>
						<ChevronRightIcon className='w-5 h-5' />
					</span>
				</Link>
			</motion.div>
		</div>
	);
};
