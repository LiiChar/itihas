import { SocketClient } from '../websocket';

export const handlerRoomJoin = async ({
	data,
	socket,
}: {
	data: {
		typeRoom: 'history' | 'page' | 'read';
		id: number;
	};
	socket: SocketClient;
}) => {
	socket.join(`${data.typeRoom}:${data.id}`);
	socket.emit(`${data.typeRoom}_room_join`, `${data.typeRoom}:${data.id}`);
};
