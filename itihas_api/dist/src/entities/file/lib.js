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
exports.slicePathByDir = exports.getFileNameFromPath = exports.changeFileName = exports.createFileByBuffer = exports.fsExistOrCreate = exports.getFolderByFileType = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const getFolderByFileType = (fileName) => {
    // Получаем расширение файла
    const extension = path_1.default.extname(fileName).toLowerCase();
    // Определяем тип файла на основе расширения
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'];
    const musicExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma'];
    // Проверяем, к какому типу относится расширение файла
    if (imageExtensions.includes(extension)) {
        return 'image'; // Папка для изображений
    }
    else if (videoExtensions.includes(extension)) {
        return 'video'; // Папка для видео
    }
    else if (musicExtensions.includes(extension)) {
        return 'sound'; // Папка для музыки
    }
    else {
        return 'other'; // Папка для файлов других типов
    }
};
exports.getFolderByFileType = getFolderByFileType;
const fsExistOrCreate = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.access(path);
        return true;
    }
    catch (error) {
        if (path.includes('.'))
            return false;
        yield promises_1.default.mkdir(path);
        return false;
    }
});
exports.fsExistOrCreate = fsExistOrCreate;
const createFileByBuffer = (path, buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        promises_1.default.writeFile(path, buffer);
    }
    catch (error) {
        if (error instanceof Error) {
            throw Error(`Create file by path - ${path} failed cause ${error.message}`);
        }
    }
});
exports.createFileByBuffer = createFileByBuffer;
const changeFileName = (filePath, newFileName) => {
    const pathParts = filePath.split('/');
    const oldFileName = pathParts.pop(); // Убираем старое имя файла
    const fileExtension = oldFileName.split('.').pop(); // Извлекаем расширение файла
    const newName = `${newFileName}.${fileExtension}`; // Создаем новое имя файла с тем же расширением
    pathParts.push(newName); // Добавляем новое имя файла
    return pathParts.join('/');
};
exports.changeFileName = changeFileName;
const getFileNameFromPath = (path) => {
    const pathLastPart = path.split('/').pop();
    const fileName = pathLastPart.split('.')[0]; // Извлекаем расширение файла
    return fileName;
};
exports.getFileNameFromPath = getFileNameFromPath;
const slicePathByDir = (path, part) => {
    const pathPart = path.split('/');
    const index = pathPart.indexOf(part);
    if (index == -1) {
        return path;
    }
    const newPathPart = pathPart.slice(index);
    return '/' + newPathPart.join('/');
};
exports.slicePathByDir = slicePathByDir;
