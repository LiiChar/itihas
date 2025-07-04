import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { MenuIcon } from 'lucide-react';
import { Avatar } from '../widget/user/avatar';
import { useUserStore } from '@/shared/store/UserStore';
import { Link, useParams } from 'react-router-dom';

export const AsideHeader = () => {
	const { user } = useUserStore();
	const { id } = useParams();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					className='absolute top-2 z-20 right-2 p-0 m-0 hover:bg-transparent'
				>
					{!user ? <MenuIcon /> : <Avatar className='w-7 h-7' user={user} />}
				</Button>
			</SheetTrigger>
			<SheetContent
				className='md:min-w-[35%] lg:min-w-[25%] sm:min-w-[40%] min-w-[50%]'
				side={'right'}
			>
				<SheetTitle>
					<Link
						to={`/profile/${id}`}
						className='flex text-foreground justify-end gap-2 mr-5'
					>
						{user && (
							<>
								<div>{user.name}</div>
								<div>
									<Avatar className='w-7 h-7' user={user} />
								</div>
							</>
						)}
					</Link>
				</SheetTitle>
				<div className='grid gap-4 py-4'>
					<Link to={`/history/${id}`}>История</Link>
					<Link to={`/`}>Главная страница</Link>
				</div>
			</SheetContent>
		</Sheet>
	);
};
