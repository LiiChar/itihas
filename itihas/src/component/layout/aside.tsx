import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { MenuIcon } from 'lucide-react';
import { useUserStore } from '@/shared/store/userStore';
import { Avatar } from '../widget/user/avatar';

export const AsideHeader = () => {
	const { isAuthorize, user } = useUserStore();
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					className='absolute top-2 right-2 p-0 m-0 hover:bg-transparent'
				>
					{!user ? <MenuIcon /> : <Avatar className='w-8 h-8' user={user} />}
				</Button>
			</SheetTrigger>
			<SheetContent
				className='w-[100%] md:min-w-1/2 sm:min-w-[50%]'
				side={'right'}
			>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>dfd</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button>Закрыть</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
