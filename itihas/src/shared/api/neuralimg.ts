import axios from 'axios';
import { Readable } from 'stream';

// type NeuralimgStatus = 'WAITING' | 'RUNNING' | 'SUCCESS';

type NeuralimgRes =
	| {
			status: 'WAITING';
			queue_position: number;
			queue_total: number;
			job_id: string;
	  }
	| {
			status: 'RUNNING';
			progress: string;
			job_id: string;
	  }
	| {
			status: 'SUCCESS';
			job_id: string;
			image_url: string;
			seed: number;
	  };

type NeuralProp = {
	prompt: string;
	width: number;
	height: number;
	seed: number;
	response_type: 'url' | 'base64';
};

export const generateImg = async (props: NeuralProp): Promise<string> => {
	const response = await axios.post(
		'https://neuroimg.art/api/v1/free-generate',
		{
			token: import.meta.env.VITE_NEURALIMG_TOKEN,
			prompt: props.prompt,
			stream: true,
		},
		{
			responseType: 'stream',
			headers: { 'Content-Type': 'application/json' },
		}
	);

	const decoder = new TextDecoder();
	const stream = response.data as unknown as Readable;

	return new Promise<string>((resolve, reject) => {
		let buffer = '';

		stream.on('data', (chunk: Buffer) => {
			try {
				const decoded = decoder.decode(chunk, { stream: true });
				buffer += decoded;

				const objects = buffer.split('\n').filter(Boolean);
				for (const obj of objects) {
					const data: NeuralimgRes = JSON.parse(obj);
					console.log(`Статус: ${data.status}`);
					if (data.status === 'SUCCESS') {
						stream.destroy();
						resolve(data.image_url);
					}
				}
			} catch (err) {
				// возможно JSON ещё не завершён — просто ждём следующую порцию
			}
		});

		stream.on('end', () => reject(new Error('Поток завершён без SUCCESS')));
		stream.on('error', (err: unknown) => reject(err));
	});
};
