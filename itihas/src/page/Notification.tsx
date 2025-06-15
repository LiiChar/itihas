import { NotificationElement } from '@/component/widget/notification/NotificationElement';
import { NotificationList } from '@/component/widget/notification/NotificationList';
import { getNotification } from '@/shared/api/notification';
import { readNotification } from '@/shared/lib/websocket/websocket';
import { useNotificationStore } from '@/shared/store/Notification';
import { useUserStore } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';
import { Loader2 } from 'lucide-react';
import React from 'react';

export const Notification = () => {
	const { setNotification, notification } = useNotificationStore();
	const { user } = useUserStore();
	const [loading, setLoading] = React.useState(true);

	useMount(() => {
		if (!user) return;
		getNotification(user.id)
			.then(data => {
				if (data.length > 0) {
					readNotification(data[0].id);
				}
				setNotification(data.reverse());
			})
			.finally(() => setLoading(false));
	});

	if (!user) {
		return (
			<div className='text-center text-gray-500 mt-10'>
				Пользователь не авторизован
			</div>
		);
	}

	if (loading) {
		return (
			<div className='flex justify-center items-center h-48'>
				<Loader2 className='animate-spin w-6 h-6 text-gray-500' />
			</div>
		);
	}

	return (
		<div className='max-w-5xl mx-auto px-4 py-6 space-y-4'>
			<h1 className='text-2xl font-bold mb-4'>Уведомления</h1>
			{notification.length === 0 ? (
				<div className='text-gray-500'>У вас нет уведомлений</div>
			) : (
				<NotificationList notifications={notification} />
			)}
		</div>
	);
};
