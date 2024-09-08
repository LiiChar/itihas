import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { MenuIcon } from 'lucide-react';
import { Avatar } from '../widget/user/avatar';
import { useUserStore } from '@/shared/store/UserStore';
import { SoundBar } from '../widget/sound/SoundBar';

export const AsideHeader = () => {
	const { user } = useUserStore();
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					className='absolute top-2 z-20 right-2 p-0 m-0 hover:bg-transparent'
				>
					{!user ? <MenuIcon /> : <Avatar className='w-8 h-8' user={user} />}
				</Button>
			</SheetTrigger>
			<SheetContent className='md:min-w-1/2 sm:min-w-[50%]' side={'right'}>
				<div className='grid gap-4 py-4'>
					<SoundBar />
				</div>
			</SheetContent>
		</Sheet>
	);
};
