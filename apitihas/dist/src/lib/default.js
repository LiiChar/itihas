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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaulBookmarks = void 0;
const db_1 = require("../database/db");
const bookmark_1 = require("../entities/bookmark/model/bookmark");
const createDefaulBookmarks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultBookmark = [
        {
            name: 'Читаю',
            userId: userId,
        },
        {
            name: 'Буду читать',
            userId: userId,
        },
        {
            name: 'Заброшено',
            userId: userId,
        },
        {
            name: 'Прочитано',
            userId: userId,
        },
        {
            name: 'Любимое',
            userId: userId,
        },
    ];
    const array = defaultBookmark;
    try {
        const idx = [];
        array.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(bookmark_1.bookmarks).values(data).returning())[0];
            idx.push(id);
        }));
        return idx;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Произошла ошибка при создании дефолныз закладок');
        }
    }
});
exports.createDefaulBookmarks = createDefaulBookmarks;
