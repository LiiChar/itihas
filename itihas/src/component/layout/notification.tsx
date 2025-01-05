import { getNotification } from '@/shared/api/notification';
import { useNotification } from '@/shared/hooks/useNotification';
import { handleImageError } from '@/shared/lib/image';
import { useNotificationStore } from '@/shared/store/Notification';
import { useUserStore } from '@/shared/store/UserStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { DropdownMenuShortcut } from '@/shared/ui/dropdown-menu';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
} from '@radix-ui/react-dropdown-menu';
import { useMount } from '@siberiacancode/reactuse';
import { Bell } from 'lucide-react';

export const Notification = () => {
	const { setNotification, notification } = useNotificationStore();
	const { user } = useUserStore();

	useMount(() => {
		if (!user) return;
		getNotification(user.id).then(data => {
			setNotification(data);
		});
	});

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild className='cursor-pointer'>
					<div className='relative '>
						{notification.filter(n => n.isRead !== 'true').length > 0 && (
							<>
								<div className='animate-ping bg-primary rounded-[50%] w-4 h-4 absolute -right-[6px] -bottom-[6px]'></div>
								<div className='absolute -right-[2px] -bottom-[8px]'>
									<span>
										{notification.filter(n => n.isRead !== 'true').length}
									</span>
								</div>
							</>
						)}
						<Bell className='stroke-primary h-[21px]' />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56 after:h-0 relative top-2  bg-secondary rounded-sm text-foreground after:border-solid after:border-b-secondary after:border-b-8 after:border-x-transparent after:border-x-4 after:border-t-0 after:-top-[7px] after:left-[122px] after:absolute'>
					<DropdownMenuLabel className='p-4 pb-2 pt-2 border-b-[1px] border-foreground'>
						Уведомления
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{user &&
						notification &&
						notification.map(n => (
							<DropdownMenuItem className=' p-4  py-2 flex items-center gap-2'>
								<div>
									<Avatar>
										<AvatarImage
											src={'image' in n ? (n.image as string) : ''}
											alt='@shadcn'
											onError={handleImageError}
										/>
										<AvatarFallback>{n.notification.message}</AvatarFallback>
									</Avatar>
								</div>
								<div>
									<div>{n.notification.message}</div>
								</div>
							</DropdownMenuItem>
						))}
					{notification.length == 0 && (
						<div className='p-4  py-2'>У вас нет уведомлений</div>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
