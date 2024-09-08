import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { useMount, useUnmount } from '@siberiacancode/reactuse';

import { Separator } from '@/shared/ui/separator';
import { LoginForm } from '@/component/pages/auth/LoginForm';
import { Background } from '@/component/pages/auth/Background';

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
			<Background text={['Добро пожаловать', 'в ваше новое путешествие']} />
			<div className='w-[clamp(300px,30%,600px)] h-full bg-secondary px-4 py-2'>
				<h2 className='text-lg'>Войти на Itihas</h2>
				<Separator orientation='horizontal' className='bg-foreground' />
				<LoginForm />
			</div>
		</div>
	);
};
