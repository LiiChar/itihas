import { getFullUrl } from '@/shared/lib/image';
import { cn } from '@/shared/lib/lib';
import { NotificationUserResponse } from '@/shared/type/notification';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import { FileEdit, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
	notification: NotificationUserResponse;
	variant?: 'default' | 'small';
	readNotification?: (id: number) => void;
	placeholderImage?: string;
};

export const NotificationElement: React.FC<Props> = props => {
	const { variant = 'default' } = props;

	switch (variant) {
		case 'small':
			return <NotificationElementSmall {...props} />;
		case 'default':
		default:
			return <NotificationElementDefault {...props} />;
	}
};

// === 🟦 SMALL VARIANT ===

const NotificationElementSmall: React.FC<Props> = ({
	notification: n,
	readNotification,
	placeholderImage = '/public/assets/guest.png',
}) => {
	const data: any = n.data;

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.src = placeholderImage;
	};

	const genNotificationMessage = () => {
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
		<motion.div
			key={n.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			onMouseEnter={() => {
				if (!n.isRead || n.isRead === 'false') {
					readNotification?.(n.id);
				}
			}}
		>
			<div className='px-4 py-1 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors'>
				<Avatar className='w-8 h-8 shrink-0'>
					<AvatarImage
						src={data?.image ? getFullUrl(data.image) : ''}
						alt='Avatar'
						onError={handleImageError}
					/>
					<AvatarFallback>
						<img
							className='object-cover h-full w-full'
							src={placeholderImage}
						/>
					</AvatarFallback>
				</Avatar>
				<div className='text-sm leading-tight break-words flex-1'>
					{genNotificationMessage()}
				</div>
			</div>
		</motion.div>
	);
};

// === 🟩 DEFAULT VARIANT ===

const NotificationElementDefault: React.FC<Props> = ({ notification: n }) => {
	const data: any = n.data;

	const isRead = (n.isRead || n.isRead === 'true') && n.isRead !== 'false';

	return (
		<div
			className={cn(
				'flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-md',
				isRead
					? 'bg-background border-primary/40'
					: 'bg-secondary border-primary'
			)}
		>
			<div className='mt-1'>{getEventIcon(n.notification.event)}</div>

			<div className='flex-1'>
				<div className='flex justify-between items-center mb-1'>
					<span className='text-sm text-gray-400'>
						{formatDate(n.createdAt)}
					</span>
					{!isRead && (
						<span className='text-xs bg-blue-600 text-foreground px-2 py-0.5 rounded-full'>
							Новое
						</span>
					)}
				</div>
				<div className='font-semibold text-foreground'>
					{n.notification.message}
				</div>
				{n.notification.description && (
					<div className='text-sm text-gray-600 mt-0.5'>
						{n.notification.description}
					</div>
				)}
				{'name' in data && (
					<div className='text-sm text-gray-500 mt-2'>
						Объект: <span className='font-medium'>{data.name}</span>
					</div>
				)}
			</div>
		</div>
	);
};

const getEventIcon = (event: string) => {
	switch (event) {
		case 'page:update':
			return <FileEdit className='text-primary' size={24} />;
		default:
			return <Bell className='text-gray-400' size={24} />;
	}
};

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleString('ru-RU', {
		day: '2-digit',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	});
}
