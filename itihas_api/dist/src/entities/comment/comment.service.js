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
exports.createReplyComment = exports.createComment = void 0;
const __1 = require("../..");
const db_1 = require("../../database/db");
const history_1 = require("../history/model/history");
const createComment = (comment) => __awaiter(void 0, void 0, void 0, function* () {
    const commentCreated = (yield db_1.db.insert(history_1.comments).values(comment).returning())[0];
    __1.socket.to('history:' + comment.historyId).emit('history_add_comment');
    return commentCreated;
});
exports.createComment = createComment;
const createReplyComment = (comment) => __awaiter(void 0, void 0, void 0, function* () {
    const commentReplyCreated = (yield db_1.db.insert(history_1.commentsToComments).values(comment).returning())[0];
    return commentReplyCreated;
});
exports.createReplyComment = createReplyComment;
