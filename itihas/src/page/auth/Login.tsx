import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { useMount, useUnmount } from '@siberiacancode/reactuse';

import { Separator } from '@/shared/ui/separator';
import { LoginForm } from '@/component/pages/auth/LoginForm';
import { Background } from '@/component/pages/auth/Background';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { setUser } from '@/shared/store/UserStore';
import {
	getUserById,
	loginUser,
	registerUser,
	updateUser,
} from '@/shared/api/user';

type GoogleCredential = {
	email: string;
	name: string;
	picture: string;
};

export const Login = () => {
	useMount(() => {
		setVisibleHeader(false);
		setVisibleFooter(false);
	});
	useUnmount(() => {
		setVisibleHeader(true);
		setVisibleFooter(true);
	});
	const navigate = useNavigate();
	return (
		<div className='flex h-screen relative overflow-hidden'>
			<motion.div
				animate={{ x: 0 }}
				initial={{ x: 200 }}
				exit={{ x: 200 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-full h-full'
			>
				<Background text={[]} />
			</motion.div>
			<motion.div
				animate={{ x: 0, opacity: 1 }}
				initial={{ x: 200 }}
				exit={{ x: 200 }}
				transition={{ ease: 'easeOut', duration: 0.5 }}
				className='w-full absolute right-0 h-full flex items-center justify-center top-0  z-[70]  '
			>
				<div className='bg-secondary p-4 min-w-[350px] rounded-md'>
					<div className='flex justify-between items-center'>
						<h2 className='text-lg'>Войти на Itihas</h2>
						<Link
							to={'/auth/register'}
							className='text-primary hover:underline'
						>
							<span className='flex -mr-1 relative after:content-[""] after:absolute  after:border-b-[2px] after:w-4 after:top-[calc(50%-0.8px)] hover:after:w-8 hover:after:-ml-4 after:transition-all transition-all text-foreground	 after:rotate-180 after:-left-1 duration-300'>
								<ChevronRightIcon className='w-5 h-5' />
							</span>
						</Link>
					</div>
					<Separator orientation='horizontal' className='bg-foreground mb-4' />
					<LoginForm />
					<div className='flex flex-col gap-2'>
						<p className='text-sm opacity-50 text-center'>или</p>
						<Separator
							orientation='horizontal'
							className='bg-foreground mb-4'
						/>
						<GoogleLogin
							onSuccess={async credentialResponse => {
								if (credentialResponse.credential) {
									const cred: GoogleCredential = jwtDecode(
										credentialResponse.credential
									);

									const login = await loginUser({
										name: cred.name,
										password: credentialResponse.clientId!,
									});

									if ('error' in login) {
										const userRes = await registerUser({
											name: cred.name,
											password: credentialResponse.clientId!,
										});
										if (userRes.data && userRes.status == 200) {
											const user = userRes.data;
											await updateUser({
												id: user.id,
												photo: cred.picture,
											});
											const userUpdated = await getUserById(user.id);
											setUser(userUpdated.data);
											navigate(-1);
										}
									} else {
										if (login.status == 200) {
											setUser(login.data);

											navigate(-1);
										}
									}
								}
							}}
							onError={() => {
								console.log('Login Failed');
							}}
						/>
					</div>
				</div>
			</motion.div>
		</div>
	);
};
