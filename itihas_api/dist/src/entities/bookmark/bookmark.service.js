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
exports.addHistoryToBookmark = exports.createBookmark = exports.getBookmarks = exports.getListBookmarks = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const bookmark_1 = require("./model/bookmark");
const history_1 = require("../history/model/history");
const getListBookmarks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let bookmarks = yield db_1.db.query.bookmarks.findMany({
        where: b => (0, drizzle_orm_1.eq)(b.userId, userId),
    });
    return bookmarks;
});
exports.getListBookmarks = getListBookmarks;
const getBookmarks = (userId, bookmarkType) => __awaiter(void 0, void 0, void 0, function* () {
    let bookmarks = yield db_1.db.query.bookmarks.findMany({
        where: b => bookmarkType
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(b.name, bookmarkType), (0, drizzle_orm_1.eq)(b.userId, userId))
            : (0, drizzle_orm_1.eq)(b.userId, userId),
        with: {
            histories: {
                with: {
                    history: {
                        with: {
                            genres: true,
                        },
                    },
                },
            },
        },
    });
    if (bookmarks.length == 0 && bookmarkType) {
        bookmarks = yield db_1.db.query.bookmarks.findMany({
            where: b => (0, drizzle_orm_1.eq)(b.userId, userId),
            with: {
                histories: {
                    with: {
                        history: {
                            with: {
                                genres: true,
                            },
                        },
                    },
                },
            },
        });
    }
    return bookmarks;
});
exports.getBookmarks = getBookmarks;
const createBookmark = (bookmarkData) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield db_1.db.insert(bookmark_1.bookmarks).values(bookmarkData).returning();
    return bookmark[0];
});
exports.createBookmark = createBookmark;
const addHistoryToBookmark = (bookmarkHistoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield db_1.db
        .insert(history_1.bookmarksToHistories)
        .values(bookmarkHistoryData)
        .returning();
    return bookmark[0];
});
exports.addHistoryToBookmark = addHistoryToBookmark;
