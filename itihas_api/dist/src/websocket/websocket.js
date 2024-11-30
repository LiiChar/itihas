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
exports.runWebsocket = void 0;
const socket_io_1 = require("socket.io");
const __1 = require("..");
const db_1 = require("../database/db");
const drizzle_orm_1 = require("drizzle-orm");
const history_service_1 = require("../entities/history/history.service");
const runWebsocket = () => {
    const io = new socket_io_1.Server(__1.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    let socketEmmiter = null;
    io.on('connection', socket => {
        // handle like history
        socket.on('history_like_add', (_a) => __awaiter(void 0, [_a], void 0, function* ({ historyId, userId, variant, }) {
            yield (0, history_service_1.updateLikeHistory)({ historyId, userId, variant });
            const historyLikes = yield db_1.db.query.histories.findFirst({
                where: histories => (0, drizzle_orm_1.eq)(histories.id, historyId),
                with: {
                    likes: true,
                },
            });
            const likes = historyLikes === null || historyLikes === void 0 ? void 0 : historyLikes.likes.reduce((acc, like) => {
                if (like.variant == 'positive') {
                    acc.positiveLike++;
                }
                else {
                    acc.negativeLike++;
                }
                return acc;
            }, { positiveLike: 0, negativeLike: 0 });
            io.to('history:' + historyId).emit('history_like_update', likes);
        }));
        // handle comment history
        socket.on('comment_like_add', (_b) => __awaiter(void 0, [_b], void 0, function* ({ commentId, userId, variant }) {
            yield (0, history_service_1.updateCommentHistory)({ commentId, userId, variant });
            const commentLikes = yield db_1.db.query.comments.findFirst({
                where: comment => (0, drizzle_orm_1.eq)(comment.id, commentId),
                with: {
                    likes: true,
                },
            });
            const likes = commentLikes === null || commentLikes === void 0 ? void 0 : commentLikes.likes.reduce((acc, like) => {
                if (like.variant == 'positive') {
                    acc.positiveLike++;
                }
                else {
                    acc.negativeLike++;
                }
                return acc;
            }, { positiveLike: 0, negativeLike: 0 });
            io.to('history:' + (commentLikes === null || commentLikes === void 0 ? void 0 : commentLikes.historyId)).emit('comment_like_update', likes);
        }));
        socket.on('comments_comment_like_add', (_c) => __awaiter(void 0, [_c], void 0, function* ({ commentsCommentId, userId, variant, }) {
            yield (0, history_service_1.updateCommentsCommentHistory)({
                commentsCommentId,
                userId,
                variant,
            });
            const commentLikes = yield db_1.db.query.commentsToComments.findFirst({
                where: comment => (0, drizzle_orm_1.eq)(comment.id, commentsCommentId),
                with: {
                    likes: true,
                },
            });
            const likes = commentLikes === null || commentLikes === void 0 ? void 0 : commentLikes.likes.reduce((acc, like) => {
                if (like.variant == 'positive') {
                    acc.positiveLike++;
                }
                else {
                    acc.negativeLike++;
                }
                return acc;
            }, { positiveLike: 0, negativeLike: 0 });
            io.to('history:' + commentsCommentId).emit('comments_comment_like_update', likes);
        }));
        socket.on('room_join', ({ id, typeRoom, }) => {
            socket.join(`${typeRoom}:${id}`);
            socket.emit(`${typeRoom}_room_join`, `${typeRoom}:${id}`);
        });
        socketEmmiter = socket;
    });
    return io;
};
exports.runWebsocket = runWebsocket;
