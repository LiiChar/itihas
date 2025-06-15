import path from 'path';
import fs from 'fs/promises';

export const getFolderByFileType = (fileName: string) => {
	// Получаем расширение файла
	const extension = path.extname(fileName).toLowerCase();

	// Определяем тип файла на основе расширения
	const imageExtensions = [
		'.jpg',
		'.jpeg',
		'.png',
		'.gif',
		'.bmp',
		'.svg',
		'.webp',
	];
	const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'];
	const musicExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma'];

	// Проверяем, к какому типу относится расширение файла
	if (imageExtensions.includes(extension)) {
		return 'image'; // Папка для изображений
	} else if (videoExtensions.includes(extension)) {
		return 'video'; // Папка для видео
	} else if (musicExtensions.includes(extension)) {
		return 'sound'; // Папка для музыки
	} else {
		return 'other'; // Папка для файлов других типов
	}
};

export const fsExistOrCreate = async (path: string): Promise<boolean> => {
	try {
		await fs.access(path);
		return true;
	} catch (error) {
		if (path.includes('.')) return false;
		await fs.mkdir(path);
		return false;
	}
};

export const createFileByBuffer = async (
	path: string,
	buffer: string | Buffer
) => {
	try {
		fs.writeFile(path, buffer);
	} catch (error) {
		if (error instanceof Error) {
			throw Error(
				`Create file by path - ${path} failed cause ${error.message}`
			);
		}
	}
};

export const changeFileName = (
	filePath: string,
	newFileName: string
): string => {
	const pathParts = filePath.split(path.sep);
	const oldFileName = pathParts.pop(); // Убираем старое имя файла

	const fileExtension = oldFileName!.split('.').pop(); // Извлекаем расширение файла
	const newName = `${newFileName}.${fileExtension}`; // Создаем новое имя файла с тем же расширением

	pathParts.push(newName); // Добавляем новое имя файла
	return pathParts.join(path.sep);
};

export const getFileNameFromPath = (pathR: string) => {
	const pathLastPart = pathR.split(path.sep).pop();

	const fileName = pathLastPart!.split('.')[0]; // Извлекаем расширение файла
	return fileName;
};

export const slicePathByDir = (pathR: string, part: string) => {
	const pathPart = pathR.split(path.sep);
	const index = pathPart.indexOf(part);
	if (index == -1) {
		return pathR;
	}
	const newPathPart = pathPart.slice(index);
	return path.sep + newPathPart.join(path.sep);
};
