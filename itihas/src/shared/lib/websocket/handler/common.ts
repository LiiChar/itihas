import { runListener } from '@/shared/store/ListenerStore';

export const historyRoomEnteredSocketHandle = (res: string) => {
	const [_type, id] = res.split(':');
	console.log('-------2');
	runListener('toastTrigger', `Вы успешно вошли в комнату:${id}`);
};
