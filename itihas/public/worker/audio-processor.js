class AudioProcessor extends AudioWorkletProcessor {
	process(inputs) {
		const input = inputs[0];
		if (input && input.length > 0) {
			const audioData = input[0]; // Получаем аудиоданные из первого канала
			const int16Data = this.convertFloat32ToInt16(audioData);

			// Отправляем аудиоданные в основной поток
			this.port.postMessage(int16Data);
		}
		return true; // Продолжаем обработку
	}

	convertFloat32ToInt16(buffer) {
		const length = buffer.length;
		const int16Array = new Int16Array(length);
		for (let i = 0; i < length; i++) {
			int16Array[i] = Math.min(1, buffer[i]) * 0x7fff; // Преобразуем в Int16
		}
		return int16Array;
	}
}

registerProcessor('audio-processor', AudioProcessor);
