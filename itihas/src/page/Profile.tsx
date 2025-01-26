import { ProfileTabs } from '@/component/pages/Profile/ProfileTabs';
import { Avatar } from '@/component/widget/user/avatar';
import { getUserById } from '@/shared/api/user';
import { formatDate } from '@/shared/lib/time';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { ExitIcon } from '@radix-ui/react-icons';
import { useClipboard, useMount, useQuery } from '@siberiacancode/reactuse';
import { Edit, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const ProfilePage = () => {
	const { id } = useParams();
	const { data, refetch } = useQuery(() => getUserById(+id!));
	const { copy } = useClipboard();
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
		<div className='flex flex-col gap-3 mt-3 mx-3'>
			<div>
				<div className='bg-secondary rounded-md p-4'>
					<div className='flex gap-3  md:flex-row items-center flex-col'>
						<div>
							<Avatar className='w-36 h-36' user={user} />
						</div>
						<div className='w-full'>
							<p>{formatDate(user.createdAt)}</p>
							<h1>{user.name}</h1>
							<div className='flex gap-1 flex-wrap'>
								{Object.entries(profileInfo).map(p => (
									<>
										{p[1] ? (
											<div
												onClick={() => copy(`${p[1]}`)}
												className='flex overflow-hidden  gap-1 bg-background/40 p-1 rounded-sm hover:text-primary'
											>
												<div className='text-nowrap'>{p[0]}:</div>
												<div>{p[1]}</div>
											</div>
										) : (
											''
										)}
									</>
								))}
							</div>
							<div>
								<h5>Описание</h5>
								<p>{user.description ?? 'Мы ничего не о вас, просвети нас'}</p>
							</div>
						</div>
						<div className='flex flex-row md:flex-col gap-2'>
							<ExitIcon
								onClick={handleSignOut}
								className='hover:stroke-primary w-5 h-5'
							/>
							<Edit className='w-5 h-5' />
							<Trash className='w-5 h-5' />
						</div>
					</div>
				</div>
			</div>
			<ProfileTabs user={user} />
		</div>
	);
};
