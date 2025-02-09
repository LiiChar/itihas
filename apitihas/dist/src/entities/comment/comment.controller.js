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
exports.commentRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../database/db");
const comment_service_1 = require("./comment.service");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const comment_scheme_1 = require("./comment.scheme");
const history_1 = require("../history/model/history");
const drizzle_orm_1 = require("drizzle-orm");
const commentRouter = (0, express_1.Router)();
exports.commentRouter = commentRouter;
commentRouter.post('/', (0, validationMiddleware_1.validateData)(comment_scheme_1.commentInsertSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentData = req.body;
    const user = (yield db_1.db.query.users.findMany())[0];
    const comment = yield (0, comment_service_1.createComment)(commentData);
    return res.json(comment).status(http_status_codes_1.StatusCodes.OK);
}));
commentRouter.get('/reply/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    if (!commentId)
        return res.json('Params not in request').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    const replyComment = yield (0, comment_service_1.getReplyComments)(+commentId);
    return res.json(replyComment).status(http_status_codes_1.StatusCodes.OK);
}));
commentRouter.post('/reply', (0, validationMiddleware_1.validateData)(comment_scheme_1.replyInsertSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentReplyData = req.body;
    const user = (yield db_1.db.query.users.findMany())[0];
    const historyId = req.query.historyId;
    const comment = yield db_1.db.query.comments.findFirst({
        where: (0, drizzle_orm_1.eq)(history_1.comments.id, commentReplyData.commentId),
    });
    if (!comment) {
        return res.json('Comment not exist').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const commentReply = yield (0, comment_service_1.createReplyComment)(commentReplyData, historyId);
    return res.json(commentReply).status(http_status_codes_1.StatusCodes.OK);
}));
