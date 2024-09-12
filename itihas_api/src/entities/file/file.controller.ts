import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import {
	changeFileName,
	fsExistOrCreate,
	getFileNameFromPath,
	getFolderByFileType,
	slicePathByDir,
} from './lib';
import { v1 } from 'uuid';
const fileRouter = Router();

fileRouter.use(fileUpload());

fileRouter.post('/', async (req: Request, res: Response) => {
	if (!req.files) {
		return res.json('File not send').status(StatusCodes.BAD_REQUEST);
	}
	if (!('file' in req.files)) {
		return res
			.json('Uncorrect name field')
			.status(StatusCodes.INTERNAL_SERVER_ERROR);
	}
	const file = req.files.file as unknown as UploadedFile;
	const date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
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

	const isExist = await fsExistOrCreate(pathDir);
	if (isExist) {
		changeFileName(pathDir, getFileNameFromPath(pathDir) + v1());
	}
	file.mv(pathDir);
	return res.json(slicePathByDir(pathDir, 'uploads')).status(StatusCodes.OK);
});

export { fileRouter };
