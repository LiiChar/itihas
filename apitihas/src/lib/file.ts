import { Request, Response } from 'express';
import multer from 'multer';
import { resolve, extname } from 'path';
export type Variant = 'image' | 'sound' | 'video';

export const UrlVariantSave: Record<Variant, string> = {
	image: 'public/uploads/image',
	sound: 'public/uploads/sound',
	video: 'public/uploads/video',
};

export const filterType: Record<
	Variant,
	(file: Express.Multer.File, cb: multer.FileFilterCallback) => void
> = {
	image: (file, cb) => {
		const extension: boolean =
			['.png', '.jpg', '.jpeg'].indexOf(
				extname(file.originalname).toLowerCase()
			) >= 0;
		const mimeType: boolean =
			['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) >= 0;
		if (extension && mimeType) {
			return cb(null, true);
		}

		cb(null, false);
	},
	sound: (file, cb) => {
		const extension: boolean =
			['.mp3', '.wav', '.ogg'].indexOf(
				extname(file.originalname).toLowerCase()
			) >= 0;
		if (extension) {
			return cb(null, true);
		}

		cb(null, false);
	},
	video: (file, cb) => {
		const extension: boolean =
			['.mp4', '.mov', '.avi'].indexOf(
				extname(file.originalname).toLowerCase()
			) >= 0;
		if (extension) {
			return cb(null, true);
		}

		cb(null, false);
	},
};

const uploadFile = (path: string, type: Variant, request: Request) => {
	const storageFile = multer.diskStorage({
		destination: path,
		filename: (req, file, cb) => {
			cb(
				null,
				`${file.filename}-${new Date().getTime().toString()}${extname(
					file.originalname
				)}`
			);
		},
	});
	return multer({
		storage: storageFile,
		fileFilter: (req, file, cb) => {
			return filterType[type](file, cb);
		},
	}).single('file');
};

export const saveFile = async (
	type: Variant,
	request: Request,
	response: Response
) => {
	const uploadFilePath = resolve(__dirname, UrlVariantSave[type]);
	try {
		return new Promise<{ filename: string; type: string }>((res, rej) => {
			const multer = uploadFile(uploadFilePath, type, request);
			multer(request, response, error => {
				if (error) {
					rej(error);
				}

				res({
					filename: `${uploadFilePath}/${request.file?.filename!}`,
					type: extname(request.file!.originalname).toLowerCase(),
				} as { filename: string; type: string });
			});
		});
	} catch (error) {
		if (error instanceof multer.MulterError) {
			throw Error('Произошла ошибка при сохранении файла');
		}
	}
};
