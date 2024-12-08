"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user/user.controller");
const history_controller_1 = require("./history/history.controller");
const page_controller_1 = require("./page/page.controller");
const file_controller_1 = require("./file/file.controller");
const comment_controller_1 = require("./comment/comment.controller");
const modules_1 = require("./modules");
const bookmark_controller_1 = require("./bookmark/bookmark.controller");
const route = (0, express_1.Router)();
exports.route = route;
route.use('/history', history_controller_1.historyRouter);
route.use('/user', user_controller_1.userRouter);
route.use('/page', page_controller_1.pageRouter);
route.use('/file', file_controller_1.fileRouter);
route.use('/comment', comment_controller_1.commentRouter);
route.use('/bookmark', bookmark_controller_1.bookmarkRouter);
route.use('/', modules_1.moduleRouter);
