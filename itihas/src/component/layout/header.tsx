import { useUserStore } from '@/shared/store/UserStore';
import { Avatar } from '../widget/user/avatar';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export const Header = () => {
	const { user } = useUserStore();
	return (
		<header className='flex bg-secondary/20 backdrop-blur-[10px] drop-shadow-2xl  w-full justify-between px-4 items-center h-14 flex-row  sticky top-0 left-0 z-50'>
			<Link to={'/'}>
				<img src={logo} height={40} width={40} />
			</Link>
			{user && (
				<div>
					<Avatar className='h-9 w-9' user={user} />
				</div>
			)}
		</header>
	);
};
