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
const pageRouter = (0, express_1.Router)();
exports.pageRouter = pageRouter;
pageRouter.post('/:id', (0, validationMiddleware_1.validateData)(page_scheme_1.pageInsertSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = (yield db_1.db.query.users.findMany())[0];
        const data = req.body;
        const page = yield (0, page_service_1.createPage)(parseInt(id), data);
        const resPage = yield (0, page_service_1.getCurrentPageByHistoryId)(page.historyId, page.id, user);
        return res.json(resPage).status(http_status_codes_1.StatusCodes.OK);
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
        const currentPage = req.params.currentPage;
        const user = (yield db_1.db.query.users.findMany())[0];
        const page = yield (0, page_service_1.getCurrentPageByHistoryId)(parseInt(id), parseInt(currentPage), user);
        return res.json(page).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error)
            return res.json(error.message).status(500);
    }
}));
