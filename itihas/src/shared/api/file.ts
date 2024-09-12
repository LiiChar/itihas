import { URL } from '../const/const';
import { axi } from './axios/axios';

export const uploadFile = async (file: FormData) => {
	const fileName = await axi.post<string>(URL + '/file', file, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return fileName;
};
