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
exports.bookmarkRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const bookmark_service_1 = require("./bookmark.service");
const bookmark_scheme_1 = require("./bookmark.scheme");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const bookmarkRouter = (0, express_1.Router)();
exports.bookmarkRouter = bookmarkRouter;
bookmarkRouter.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.query.user_id) !== null && _a !== void 0 ? _a : req.cookies.user.id;
    if (!userId) {
        return res.json('Id not exist in request').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const bookmarks = yield (0, bookmark_service_1.getListBookmarks)(userId);
    return res.json(bookmarks);
}));
bookmarkRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bookmarkType = req.query.bookmark;
    const userId = (_b = req.query.user_id) !== null && _b !== void 0 ? _b : req.cookies.user.id;
    if (!userId) {
        return res.json('Id not exist in request').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const bookmarks = (0, bookmark_service_1.getBookmarks)(userId, bookmarkType);
    return res.json(bookmarks);
}));
bookmarkRouter.post('/', (0, validationMiddleware_1.validateData)(bookmark_scheme_1.bookmarkInsertSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const bookmark = yield (0, bookmark_service_1.createBookmark)(data);
    return res.json(bookmark);
}));
bookmarkRouter.post('/history', (0, validationMiddleware_1.validateData)(bookmark_scheme_1.bookmarkHistoryInsertSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const bookmark = yield (0, bookmark_service_1.addHistoryToBookmark)(data);
    return res.json(bookmark);
}));
bookmarkRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
