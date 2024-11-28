import { ProfileTabs } from '@/component/pages/Profile/ProfileTabs';
import { Avatar } from '@/component/widget/user/avatar';
import { getUserById } from '@/shared/api/user';
import { formatDate } from '@/shared/lib/time';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { ExitIcon } from '@radix-ui/react-icons';
import { useMount, useQuery } from '@siberiacancode/reactuse';
import { useNavigate, useParams } from 'react-router-dom';

export const ProfilePage = () => {
	const { id } = useParams();
	const { data, refetch } = useQuery(() => getUserById(+id!));
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

	return (
		<div className='flex flex-col gap-3 mt-3 mx-3'>
			<div>
				<div className='bg-secondary rounded-md p-4'>
					<div className='flex gap-3'>
						<div>
							<Avatar className='w-36 h-36' user={user} />
						</div>
						<div className='w-full'>
							<p>{formatDate(user.createdAt)}</p>
							<h1>{user.name}</h1>
							<p>{user.email}</p>
							<p>{user.description}</p>
							<p>{user.location}</p>
							<p>{user.role}</p>
							<p>{user.dignity}</p>
							<p>{user.age}</p>
							<p>{user.comments.length}</p>
							{user.authorHistories && <p>{user.authorHistories.length}</p>}

							{user.likes && <p>{user.likes.length}</p>}
						</div>
						<div>
							<ExitIcon
								onClick={handleSignOut}
								className='hover:stroke-primary'
							/>
						</div>
					</div>
				</div>
			</div>
			<ProfileTabs user={user} />
		</div>
	);
};
