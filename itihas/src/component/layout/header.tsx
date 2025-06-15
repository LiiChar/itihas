import { useUserStore } from '@/shared/store/UserStore';
import { Avatar } from '../widget/user/avatar';

import { Link } from 'react-router-dom';
import { PlusCircle, UserCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

import { Notification } from './notification';
import { Menu } from '../widget/layout/Menu';
import { ChangeTheme } from '../widget/theme/ChangeTheme';

export const Header = () => {
	const { user } = useUserStore();

	return (
		<header className='flex bg-secondary/20 backdrop-blur-[10px] drop-shadow-2xl  w-full justify-between  items-center h-14 flex-row px-8  sticky top-0 left-0 z-[50]'>
			<Menu />

			<div className='flex h-full items-center gap-2 justify-end w-1/3'>
				{user && (
					<>
						<Tooltip>
							<TooltipTrigger>
								<Link to={'history/create'}>
									<PlusCircle className='h-5 w-5' />
								</Link>
							</TooltipTrigger>
							<TooltipContent>Создать свою историю</TooltipContent>
						</Tooltip>
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
				<ChangeTheme />
			</div>
		</header>
	);
};
