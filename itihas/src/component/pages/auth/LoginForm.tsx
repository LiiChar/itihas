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

const loginFormScheme = z
	.object({
		username: z
			.string()
			.min(3, 'Имя слишком короткое')
			.max(25, 'Имя слишком длинное'),
		password: z.string().min(8, 'Пароль слишком короткий'),
	})
	.superRefine(({ password }, checkPassComplexity) => {
		const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
		const containsLowercase = (ch: string) => /[a-z]/.test(ch);
		const containsSpecialChar = (ch: string) =>
			/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
		let countOfUpperCase = 0,
			countOfLowerCase = 0,
			countOfNumbers = 0,
			countOfSpecialChar = 0;

		for (let i = 0; i < password.length; i++) {
			let ch = password.charAt(i);
			if (!isNaN(+ch)) countOfNumbers++;
			else if (containsUppercase(ch)) countOfUpperCase++;
			else if (containsLowercase(ch)) countOfLowerCase++;
			else if (containsSpecialChar(ch)) countOfSpecialChar++;
		}

		let errObj = {
			upperCase: { pass: true, message: 'Добавьте знаки в верхнем регистре' },
			lowerCase: { pass: true, message: 'Добавьте знаки в нижнем регистре' },
			specialCh: { pass: true, message: 'Добавьте специальные символы' },
			totalNumber: { pass: true, message: 'Добавьте число' },
		};

		if (countOfLowerCase < 1) {
			errObj = { ...errObj, lowerCase: { ...errObj.lowerCase, pass: false } };
		}
		if (countOfNumbers < 1) {
			errObj = {
				...errObj,
				totalNumber: { ...errObj.totalNumber, pass: false },
			};
		}
		if (countOfUpperCase < 1) {
			errObj = { ...errObj, upperCase: { ...errObj.upperCase, pass: false } };
		}
		if (countOfSpecialChar < 1) {
			errObj = { ...errObj, specialCh: { ...errObj.specialCh, pass: false } };
		}

		if (
			countOfLowerCase < 1 ||
			countOfUpperCase < 1 ||
			countOfSpecialChar < 1 ||
			countOfNumbers < 1
		) {
			checkPassComplexity.addIssue({
				code: 'custom',
				path: ['password'],
				message:
					Object.values(errObj).find(e => e.pass == false)?.message ?? '',
			});
		}
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