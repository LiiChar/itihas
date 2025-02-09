import { useUserStore } from '@/shared/store/UserStore';
import { Avatar } from '../widget/user/avatar';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { PlusCircle, UserCircle } from 'lucide-react';
import { Search } from '../widget/Search';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Notification } from './notification';

export const Header = () => {
	const { user } = useUserStore();

	return (
		<header className='flex bg-secondary/20 backdrop-blur-[10px] drop-shadow-2xl  w-full justify-between  items-center h-14 flex-row px-14  sticky top-0 left-0 z-50'>
			<div className='flex h-full items-center gap-4 w-2/3'>
				<Link to={'/'} className='relative'>
					<img src={logo} height={40} width={40} />
					{/* <img
						className='bg-transparent top-0 w-full h-auto scale-[2.5] left-[3px] absolute '
						src={getFullUrl('/assets/hat.png')}
					/> */}
				</Link>
				<Link to={'/library'} className='ml-3'>
					Библиотека
				</Link>

				<Search />
			</div>

			<div className='flex h-full items-center gap-2 justify-end w-1/3'>
				{user && (
					<>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Link to={'history/create'}>
										<PlusCircle className='h-5 w-5' />
									</Link>
								</TooltipTrigger>
								<TooltipContent>Создать свою историю</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Notification />

						<Link to={`/profile/${user.id}`}>
							<Avatar className='h-9 w-9' user={user} />
						</Link>
					</>
				)}
				{!user && (
					<>
						<Link to={'/auth/login'}>
							<UserCircle />
						</Link>
					</>
				)}
			</div>
		</header>
	);
};
