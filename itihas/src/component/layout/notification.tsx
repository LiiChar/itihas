import { getNotification } from '@/shared/api/notification';
import placeholderImage from '@/assets/not_found_flower.jpg';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { cn } from '@/shared/lib/lib';
import { readNotification } from '@/shared/lib/websocket/websocket';
import { useNotificationStore } from '@/shared/store/Notification';
import { useUserStore } from '@/shared/store/UserStore';
import { NotificationUserResponse } from '@/shared/type/notification';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { useMount } from '@siberiacancode/reactuse';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Notification = () => {
	const { setNotification, notification } = useNotificationStore();
	const { user } = useUserStore();

	useMount(() => {
		if (!user) return;
		getNotification(user.id).then(data => {
			readNotification(data[0].id);
			setNotification(data);
		});
	});

	const unreadCount = notification.filter(n => n.isRead !== true).length;

	const genNotificationMessage = (n: NotificationUserResponse) => {
		const data: any = n.data;
		if (n.notification.event === 'page:update') {
			return (
				<Link
					to={`/history/${data.historyId}`}
					className='text-primary hover:underline'
				>
					{data.name}: {n.notification.message}
				</Link>
			);
		}
		return n.notification.message;
	};

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className='relative cursor-pointer'>
						<AnimatePresence>
							{unreadCount > 0 && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0 }}
									transition={{ type: 'spring', stiffness: 300 }}
									className='absolute -top-2 -right-2 w-full h-4 rounded-full bg-primary/100 text-white text-xs flex items-center justify-center'
								>
									{unreadCount}
								</motion.div>
							)}
						</AnimatePresence>
						<Bell
							className={cn(
								'stroke-foreground hover:stroke-primary transition-all duration-200',
								unreadCount > 0 && 'animate-ding'
							)}
							size={21}
						/>
					</div>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className='w-80 mt-3 z-50 bg-secondary rounded-lg shadow-lg border border-border overflow-hidden'
					sideOffset={10}
				>
					<DropdownMenuLabel className='px-4 py-2 border-b text-base font-semibold'>
						Уведомления
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<div className='max-h-80 mb-2 overflow-y-auto'>
						<AnimatePresence>
							{notification.length > 0 ? (
								notification.map(n => (
									<motion.div
										key={n.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										onMouseEnter={() => {
											if (!n.isRead || n.isRead == 'false') {
												readNotification(n.id);
											}
										}}
									>
										<DropdownMenuItem className='px-4 py-1 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors'>
											<Avatar className='w-8 h-8 shrink-0'>
												<AvatarImage
													src={
														(n.data as any).image
															? getFullUrl((n.data as any).imag)
															: ''
													}
													alt='Avatar'
													onError={handleImageError}
												/>
												<AvatarFallback>
													<img
														className='object-cover h-full w-full '
														src={placeholderImage}
													/>
												</AvatarFallback>
											</Avatar>
											<div className='text-sm leading-tight break-words flex-1'>
												{genNotificationMessage(n)}
											</div>
										</DropdownMenuItem>
									</motion.div>
								))
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className='px-4 py-4 text-muted-foreground text-sm'
								>
									У вас нет уведомлений
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
