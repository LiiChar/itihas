import { SocketClient } from '../../../websocket/websocket';
// import {Model, Recognizer} from 'vosk'
export const handleTranscription = (socket: SocketClient) => {
	// const stream = model.createStream();
	// socket.on(
	// 	'transcription_send',
	// 	async ({ sound }: { sound: Buffer | string }) => {
	// 		if (sound instanceof Buffer) {
	// 			stream.feedAudioContent(sound);
	// 			const transcript = stream.intermediateDecode();
	// 			socket.emit('transcription_receive', { transcript });
	// 		} else if (sound === 'end') {
	// 			// Обработка аудио после завершения передачи
	// 			const transcript = stream.finishStream();
	// 			socket.emit('transcription_receive', { transcript });
	// 		}
	// 	}
	// );
};
