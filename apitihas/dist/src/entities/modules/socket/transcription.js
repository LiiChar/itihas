"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTranscription = void 0;
// import {Model, Recognizer} from 'vosk'
const handleTranscription = (socket) => {
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
exports.handleTranscription = handleTranscription;
