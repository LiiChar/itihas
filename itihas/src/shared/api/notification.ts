import { URL } from '../const/const';
import { NotificationUserResponse } from '../type/notification';
import { axi } from './axios/axios';

const BASE_URL = URL + '/notification';

export const getNotification = async (userId: number) => {
	const notification = await axi.get<NotificationUserResponse>(
		BASE_URL + `?user_id=${userId}`
	);
	if (!Array.isArray(notification.data)) return [];
	return notification.data;
};
