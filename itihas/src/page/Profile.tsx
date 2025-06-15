import { ProfileTabs } from '@/component/pages/Profile/ProfileTabs';
import { Avatar } from '@/component/widget/user/avatar';
import { getUserById, updateUser } from '@/shared/api/user';
import { formatDate } from '@/shared/lib/time';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { setUser, useUserStore } from '@/shared/store/UserStore';
import { ExitIcon } from '@radix-ui/react-icons';
import { useClipboard, useMount, useQuery } from '@siberiacancode/reactuse';
import { Edit, ShieldCheckIcon, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ProfilePage = () => {
	const { id } = useParams();
	const { data, refetch } = useQuery(() => getUserById(+id!));
	const { copy } = useClipboard();
	const { user: User } = useUserStore();
	const navigate = useNavigate();

	const { addCallback } = useListenerStore();
	useMount(() => {
		addCallback('userChange', () => refetch());
	});
	if (!data || !data.data || data.status != 200) {
		return 'Loading...';
	}
	const user = data.data;

	const handleSignOut = () => {
		useUserStore.setState({ isAuthorize: false, user: undefined });
		navigate('/');
	};

	const profileInfo = {
		Почта: user.email,
		Местоположение: user.location,
		Роль: user.role,
		Значимость: user.dignity,
		Возраст: user.age,
		'Написанных комментариев': user.comments.length,
		'Написанных историй': user.authorHistories?.length ?? 0,
		'Поставлено лайков': user.likes?.length ?? 0,
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-3 mt-3 mx-3'
		>
			<div>
				<div className='bg-secondary rounded-md p-4'>
					<div className='flex gap-3 md:flex-row items-center flex-col'>
						<div>
							<Avatar className='w-36 h-36' user={user} />
						</div>
						<div className='w-full'>
							<p className='text-sm text-gray-500'>
								{formatDate(user.createdAt)}
							</p>
							<h1 className='text-2xl font-bold'>{user.name}</h1>
							<div className='flex gap-1 flex-wrap'>
								{Object.entries(profileInfo).map(([key, value]) =>
									value ? (
										<motion.div
											key={key}
											whileHover={{ scale: 1.05 }}
											onClick={() => copy(`${value}`)}
											className='flex overflow-hidden gap-1 bg-background/40 p-1 rounded-sm hover:text-primary cursor-pointer'
										>
											<div className='text-nowrap'>{key}:</div>
											<div>{value}</div>
										</motion.div>
									) : (
										''
									)
								)}
							</div>
							<div className='mt-4'>
								<h5 className='text-lg font-semibold'>Описание</h5>
								<p className=''>
									{user.description ??
										'Мы ничего не знаем о вас, просветите нас'}
								</p>
							</div>
						</div>
						{(User?.role == 'admin' || User?.id == user.id) && (
							<div className='flex flex-row md:flex-col gap-2'>
								<ExitIcon
									onClick={handleSignOut}
									className='hover:stroke-primary w-5 h-5 cursor-pointer'
								/>
								<Edit className='w-5 h-5 cursor-pointer' />
								<Trash className='w-5 h-5 cursor-pointer' />
								<ShieldCheckIcon
									className='w-5 h-5 cursor-pointer'
									onClick={() => {
										updateUser({ id: user.id, role: 'admin' }).then(
											async () => {
												const user = await getUserById(+id!);
												setUser(user.data);
											}
										);
									}}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<ProfileTabs user={user} />
		</motion.div>
	);
};
