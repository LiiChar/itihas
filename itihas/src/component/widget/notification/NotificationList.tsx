// components/NotificationList.tsx
import { NotificationUserResponse } from '@/shared/type/notification';
import React from 'react';
import { NotificationElement } from './NotificationElement';

type Props = {
	notifications: NotificationUserResponse[];
};

export const NotificationList: React.FC<Props> = ({ notifications }) => {
	if (notifications.length === 0) {
		return (
			<div className='text-gray-500 text-center py-4'>
				У вас нет уведомлений
			</div>
		);
	}

	return (
		<div className='space-y-2'>
			{notifications.map(n => (
				<NotificationElement key={n.id} notification={n} variant='default' />
			))}
		</div>
	);
};
