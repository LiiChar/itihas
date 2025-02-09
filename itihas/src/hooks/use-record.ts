import { useEffect, useState, useCallback } from 'react';
import Recorder from 'recorder-js';

export const useRecord = (options?: {
	onStart?: () => void;
	onStop?: (blob: Blob) => void;
	onError?: (error: string) => void;
	onListening?: (buffer: Buffer) => void;
}) => {
	const { onStart, onStop, onError } = options || {};
	const [_isListening, setIsListening] = useState(false);
	const [recorder, setRecorder] = useState<Recorder | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isRecording, setIsRecording] = useState(false);

	const initRecorder = async () => {
		try {
			const audioContext = new window.AudioContext();
			const recorder = new Recorder(audioContext);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			await audioContext.audioWorklet.addModule('./worker/audio-processor.js');
			const workletNode = new AudioWorkletNode(audioContext, 'audio-processor');

			// Обработка данных из AudioWorklet
			workletNode.port.onmessage = event => {
				const audioData: Buffer = event.data;
				options?.onListening && options.onListening(audioData);
			};

			// Создаем источник звука из микрофона
			const source = audioContext.createMediaStreamSource(stream);

			// Подключаем источник к AudioWorklet
			source.connect(workletNode);
			workletNode.connect(audioContext.destination);

			setIsListening(true);
			setRecorder(recorder);
		} catch (err) {
			const errorMessage =
				'Ошибка при инициализации записи: ' + (err as Error).message;
			setError(errorMessage);
			onError?.(errorMessage);
		}
	};

	useEffect(() => {
		initRecorder();
	}, []);

	const startRecording = useCallback(async () => {
		if (recorder) {
			try {
				await recorder.start();
				setIsRecording(true);
				onStart?.();
			} catch (err) {
				const errorMessage =
					'Ошибка при запуске записи: ' + (err as Error).message;
				setError(errorMessage);
				onError?.(errorMessage);
			}
		}
	}, [recorder, onStart, onError]);

	const stopRecording = useCallback(async () => {
		if (recorder) {
			try {
				const { blob } = await recorder.stop();
				setIsRecording(false);
				onStop?.(blob);
				return blob;
			} catch (err) {
				const errorMessage =
					'Ошибка при остановке записи: ' + (err as Error).message;
				setError(errorMessage);
				onError?.(errorMessage);
			}
		}
	}, [recorder, onStop, onError]);

	useEffect(() => {
		return () => {
			if (recorder) {
				recorder.stop();
			}
		};
	}, [recorder]);

	return { recorder, isRecording, error, startRecording, stopRecording };
};
