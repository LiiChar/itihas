"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.filterType = exports.UrlVariantSave = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
exports.UrlVariantSave = {
    image: 'public/uploads/image',
    sound: 'public/uploads/sound',
    video: 'public/uploads/video',
};
exports.filterType = {
    image: (file, cb) => {
        const extension = ['.png', '.jpg', '.jpeg'].indexOf((0, path_1.extname)(file.originalname).toLowerCase()) >= 0;
        const mimeType = ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) >= 0;
        if (extension && mimeType) {
            return cb(null, true);
        }
        cb(null, false);
    },
    sound: (file, cb) => {
        const extension = ['.mp3', '.wav', '.ogg'].indexOf((0, path_1.extname)(file.originalname).toLowerCase()) >= 0;
        if (extension) {
            return cb(null, true);
        }
        cb(null, false);
    },
    video: (file, cb) => {
        const extension = ['.mp4', '.mov', '.avi'].indexOf((0, path_1.extname)(file.originalname).toLowerCase()) >= 0;
        if (extension) {
            return cb(null, true);
        }
        cb(null, false);
    },
};
const uploadFile = (path, type, request) => {
    const storageFile = multer_1.default.diskStorage({
        destination: path,
        filename: (req, file, cb) => {
            cb(null, `${file.filename}-${new Date().getTime().toString()}${(0, path_1.extname)(file.originalname)}`);
        },
    });
    return (0, multer_1.default)({
        storage: storageFile,
        fileFilter: (req, file, cb) => {
            return exports.filterType[type](file, cb);
        },
    }).single('file');
};
const saveFile = (type, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadFilePath = (0, path_1.resolve)(__dirname, exports.UrlVariantSave[type]);
    try {
        return new Promise((res, rej) => {
            const multer = uploadFile(uploadFilePath, type, request);
            multer(request, response, error => {
                var _a;
                if (error) {
                    rej(error);
                }
                res({
                    filename: `${uploadFilePath}/${(_a = request.file) === null || _a === void 0 ? void 0 : _a.filename}`,
                    type: (0, path_1.extname)(request.file.originalname).toLowerCase(),
                });
            });
        });
    }
    catch (error) {
        if (error instanceof multer_1.default.MulterError) {
            throw Error('Произошла ошибка при сохранении файла');
        }
    }
});
exports.saveFile = saveFile;
//# sourceMappingURL=file.js.map