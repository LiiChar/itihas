import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { Search } from '../Search';
import { MenuIcon } from 'lucide-react';
import { ProfileLink } from './ProfileLink';

export const Menu = () => {
	return (
		<div>
			<div className='md:block hidden'>
				<div className='flex h-full items-center gap-4 w-full'>
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
					<Link to={'/characters'} className='ml-3'>
						Карточки
					</Link>

					<Search />
				</div>
			</div>
			<div className=' md:hidden block h-[24px]'>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<MenuIcon className='w-[24px] h-[24px] hover:stroke-primary' />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Itihas</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<ProfileLink>Профиль</ProfileLink>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link to={'library'}>Библиотека</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link to={'/characters/'}>Карточки</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
