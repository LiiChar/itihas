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
exports.pageRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../database/db");
const page_service_1 = require("./page.service");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const page_scheme_1 = require("./page.scheme");
const error_1 = require("../../lib/error");
const notification_1 = require("../modules/socket/notification");
const pageRouter = (0, express_1.Router)();
exports.pageRouter = pageRouter;
pageRouter.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const historyId = req.query.historyId;
    const pages = yield (0, page_service_1.getPageList)(historyId ? +historyId : undefined);
    return res.json(pages);
}));
pageRouter.post('/filter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = Object.assign(req.query, req.body);
    const pages = yield (0, page_service_1.getPages)(params);
    return res.json(pages);
}));
pageRouter.post('/code', (0, validationMiddleware_1.validateData)(page_scheme_1.runCodeScheme), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, historyId, userId } = req.body;
        const pageId = yield (0, page_service_1.runCode)(code, historyId, userId);
        return res
            .json({ pageId, message: 'Code succefully execute' })
            .status(200);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.post('/:id', (0, validationMiddleware_1.validateData)(page_scheme_1.pageInsertSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = (yield db_1.db.query.users.findMany())[0];
        const data = req.body;
        const page = yield (0, page_service_1.createPage)(parseInt(id), data);
        const resPage = yield (0, page_service_1.getCurrentPageByHistoryId)(page.historyId, page.id, user);
        yield (0, notification_1.notificationEvent)('page:update', Object.assign(page, { userId: +user.id, id: +page.id }));
        return res.json(resPage).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
        if (error instanceof error_1.ErrorBoundary)
            return res.json(error.message).status(500);
    }
}));
pageRouter.put('/layout/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            throw Error('Id not found in params');
        }
        const user = (yield db_1.db.query.users.findMany())[0];
        const data = req.body;
        const layouts = yield (0, page_service_1.updateLayoutPage)(user.id, +id, data.id, data);
        return res.json(layouts);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.put('/action/:action', (0, validationMiddleware_1.validateData)(page_scheme_1.pagePointUpdateScheme), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const action = req.params.action;
        const data = req.body;
        const page = yield (0, page_service_1.updateAction)(parseInt(action), data);
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.delete('/action/:action', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const action = req.params.action;
        const page = yield (0, page_service_1.deleteActionById)(parseInt(action));
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.get('/action/:action', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const action = req.params.action;
        const user = (yield db_1.db.query.users.findMany())[0];
        const page = yield (0, page_service_1.executeActionPage)(parseInt(action), user);
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = (yield db_1.db.query.users.findMany())[0];
        const data = req.body;
        const page = yield (0, page_service_1.updatePage)(parseInt(id), data);
        yield (0, notification_1.notificationEvent)('page:add', Object.assign(page, { userId: +user.id, id: +page.id }));
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.post('/:currentPage/point', (0, validationMiddleware_1.validateData)(page_scheme_1.pagePointInsertScheme), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.currentPage;
        const data = req.body;
        const user = (yield db_1.db.query.users.findMany())[0];
        const page = yield (0, page_service_1.createPagePoint)(parseInt(id), data);
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.get('/:id/:currentPage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.query.userId;
        const currentPage = req.params.currentPage;
        let user = (yield db_1.db.query.users.findMany()).find(el => el.id == +`${userId !== null && userId !== void 0 ? userId : 1}`);
        if (!user) {
            user = (yield db_1.db.query.users.findMany())[0];
        }
        const page = yield (0, page_service_1.getCurrentPageByHistoryId)(parseInt(id), parseInt(currentPage), user);
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
pageRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            throw Error('Id not found in params');
        }
        const page = yield (0, page_service_1.getPage)(parseInt(id));
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
//# sourceMappingURL=page.controller.js.map