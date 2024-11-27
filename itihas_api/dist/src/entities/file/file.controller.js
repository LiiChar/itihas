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
exports.fileRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const lib_1 = require("./lib");
const fileRouter = (0, express_1.Router)();
exports.fileRouter = fileRouter;
fileRouter.use((0, express_fileupload_1.default)());
fileRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files) {
            return res.json('File not send').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (!('file' in req.files)) {
            return res
                .json('Uncorrect name field')
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
        const file = req.files.file;
        const date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
        const folder = (0, lib_1.getFolderByFileType)(file.name);
        let pathDir = path_1.default.join(__dirname, '..', '..', '..', 'public', 'uploads', folder, date, file.name);
        const isExist = yield (0, lib_1.fsExistOrCreate)(pathDir.slice(0, pathDir.lastIndexOf('/')));
        if (isExist) {
            return res
                .json((0, lib_1.slicePathByDir)(pathDir, 'uploads'))
                .status(http_status_codes_1.StatusCodes.OK);
        }
        yield file.mv(pathDir);
        const isCreated = yield (0, lib_1.fsExistOrCreate)(pathDir);
        if (!isCreated) {
            const buffer = file.data;
            yield (0, lib_1.createFileByBuffer)(pathDir, buffer);
        }
        return res.json((0, lib_1.slicePathByDir)(pathDir, 'uploads')).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error) {
            return res
                .json('Upload file failed: ' + error.message)
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}));
