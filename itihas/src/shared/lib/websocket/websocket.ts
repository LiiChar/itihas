import io from 'socket.io-client';
import {
	historyAddCommentSocketHandle,
	historyAddSocketHandler,
} from './handler/history';
import { historyRoomEnteredSocketHandle } from './handler/common';

const wsServerUrl = import.meta.env.VITE_SERVER_URL!.slice(
	0,
	import.meta.env.VITE_SERVER_URL!.lastIndexOf('/api')
);

type TypeRoom = 'history' | 'page' | 'read';

export const joinToRoom = (room: TypeRoom, id: number) => {
	socket.emit('room_join', {
		typeRoom: room,
		id: id,
	});
};

export const readNotification = (nId: number) => {
	socket.emit('notification_read', {
		notificationId: nId,
	});
};

export const websocketPath = [
	'history_add',
	'history_like',
	'history_add_comment',
	'history_room_join',
	'page_room_join',
	'read_room_join',
	'transcription_send',
	'transcription_receive',
] as const;

export type WebsocketPath = (typeof websocketPath)[number];

export const socket = io(wsServerUrl);

export const socketListener = () => {
	socket.on('history_add', historyAddSocketHandler);
	socket.on('history_like', historyAddSocketHandler);
	socket.on('history_add_comment', historyAddCommentSocketHandle);
	socket.on('history_room_join', historyRoomEnteredSocketHandle);
	socket.on('page_room_join', historyRoomEnteredSocketHandle);
	socket.on('read_room_join', historyRoomEnteredSocketHandle);
};
