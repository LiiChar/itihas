import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import {
	changeFileName,
	createFileByBuffer,
	fsExistOrCreate,
	getFileNameFromPath,
	getFolderByFileType,
	slicePathByDir,
} from './lib';
import { v1 } from 'uuid';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

const fileRouter = Router();

fileRouter.use(fileUpload());

fileRouter.post('/', async (req: Request, res: Response) => {
	try {
		if (!req.files) {
			return res.json('File not send').status(StatusCodes.BAD_REQUEST);
		}
		if (!('file' in req.files)) {
			return res
				.json('Uncorrect name field')
				.status(StatusCodes.INTERNAL_SERVER_ERROR);
		}
		let file = req.files.file as unknown as UploadedFile;

		const date = `${new Date().getDate()}-${
			new Date().getMonth() + 1
		}-${new Date().getFullYear()}`;
		const folder = getFolderByFileType(file.name);
		let pathDir = path.join(
			__dirname,
			'..',
			'..',
			'..',
			'public',
			'uploads',
			folder,
			date,
			file.name
		);

		await fsExistOrCreate(pathDir.slice(0, pathDir.lastIndexOf('/')));

		await file.mv(pathDir);
		const isCreated = await fsExistOrCreate(pathDir);
		if (!isCreated) {
			const buffer = file.data;
			await createFileByBuffer(pathDir, buffer);
		}
		await sharp(pathDir)
			.webp({
				quality: 75,
			})
			.toFile(pathDir.slice(0, pathDir.lastIndexOf('.')) + '.webp');
		await unlink(pathDir);
		return res
			.json(
				slicePathByDir(
					pathDir.slice(0, pathDir.lastIndexOf('.')) + '.webp',
					'uploads'
				)
			)
			.status(StatusCodes.OK);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.json('Upload file failed: ' + error.message)
				.status(StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
});

export { fileRouter };
