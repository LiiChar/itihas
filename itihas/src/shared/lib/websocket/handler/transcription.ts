import { useState } from 'react';
import { socket, WebsocketPath } from '../websocket';

export const transcriptTextSend = (sound: Buffer | string) => {
	socket.send('transcription_send', { sound });
};

export const useSocketListener = <T>(
	listener: WebsocketPath,
	cb?: (data: T) => void
): { data: T | null } => {
	const [data, setData] = useState<T | null>(null);

	socket.on(listener, (data: T) => {
		setData(data);
		cb && cb(data);
	});

	return { data };
};
