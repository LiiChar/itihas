import { useUserStore } from '@/shared/store/UserStore';
import { Avatar } from '../widget/user/avatar';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Search } from '../widget/Search';

export const Header = () => {
	const { user } = useUserStore();
	return (
		<header className='flex bg-secondary/20 backdrop-blur-[10px] drop-shadow-2xl  w-full justify-between px-4 items-center h-14 flex-row  sticky top-0 left-0 z-50'>
			<div className='flex h-full items-center gap-2 justify-between w-1/2'>
				<Link to={'/'}>
					<img src={logo} height={40} width={40} />
				</Link>
				<Search />
			</div>
			{user && (
				<Link to={`/profile/${user.id}`}>
					<Avatar className='h-9 w-9' user={user} />
				</Link>
			)}
			{!user && (
				<Link to={'/auth/login'}>
					<UserCircle />
				</Link>
			)}
		</header>
	);
};
