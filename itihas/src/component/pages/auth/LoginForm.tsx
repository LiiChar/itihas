import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { login } from '@/shared/store/UserStore';

const loginFormScheme = z.object({
	username: z
		.string()
		.min(3, 'Имя слишком короткое')
		.max(25, 'Имя слишком длинное'),
	password: z.string().min(8, 'Пароль слишком короткий'),
});

export const LoginForm = () => {
	const form = useForm<z.infer<typeof loginFormScheme>>({
		resolver: zodResolver(loginFormScheme),
		defaultValues: {
			username: '',
			password: '',
		},
	});
	const navigate = useNavigate();
	const onSubmitLogin = async (values: z.infer<typeof loginFormScheme>) => {
		await login({
			name: values.username,
			password: values.password,
		});
		navigate('/');
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitLogin)} className=''>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Имя</FormLabel>
							<FormControl>
								<Input
									className='bg-background -translate-y-2'
									placeholder='Введите имя'
									{...field}
								/>
							</FormControl>
							<FormMessage className='-translate-y-4' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Пароль</FormLabel>
							<FormControl>
								<Input
									className='bg-background -translate-y-2'
									placeholder='Введите пароль'
									{...field}
								/>
							</FormControl>
							<FormMessage className='-translate-y-4' />
						</FormItem>
					)}
				/>
				<Button type='submit'>Войти</Button>
			</form>
		</Form>
	);
};
