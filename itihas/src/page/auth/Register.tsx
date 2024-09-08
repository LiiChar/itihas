import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { useMount, useUnmount } from '@siberiacancode/reactuse';

import { Separator } from '@/shared/ui/separator';
import { Background } from '@/component/pages/auth/Background';
import { RegisterForm } from '@/component/pages/auth/RegisterForm';

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
			<Background text={['Добро пожаловать', 'в ваше новое путешествие']} />
			<div className='w-[clamp(300px,40%,600px)] h-full bg-secondary px-4 py-2'>
				<h2 className='text-lg'>Зарегестрироваться на Itihas</h2>
				<Separator orientation='horizontal' className='bg-foreground' />
				<RegisterForm />
			</div>
		</div>
	);
};
