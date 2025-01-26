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
exports.historyRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const history_service_1 = require("./history.service");
const db_1 = require("../../database/db");
const historyRouter = (0, express_1.Router)();
exports.historyRouter = historyRouter;
historyRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const history = yield (0, history_service_1.getHistories)(params);
        return res.json(history).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        console.log(error);
        return res.json('Get history failed').status(404);
    }
}));
historyRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const history = yield (0, history_service_1.updateHistory)(+id, data);
        return res.json(history).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        console.log(error);
        return res.json('Update history failed').status(404);
    }
}));
historyRouter.post('/catalog', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = Object.assign(req.query, req.body);
        const history = yield (0, history_service_1.getHistories)(params);
        return res.json(history).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        console.log(error);
        return res
            .json('Get history failed')
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
historyRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const dataHistory = req.body;
        const user = (yield db_1.db.query.users.findMany())[0];
        const history = yield (0, history_service_1.createHistory)(Object.assign(Object.assign({}, dataHistory), { authorId: (_a = dataHistory.authorId) !== null && _a !== void 0 ? _a : user.id }));
        return res.json(history).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.json(error.message).status(http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
}));
historyRouter.get('/layout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const layouts = yield (0, history_service_1.getLayouts)();
    return res.json(layouts);
}));
historyRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = (yield db_1.db.query.users.findMany())[0];
        const history = yield (0, history_service_1.getHistory)(parseInt(id), user);
        return res.json(history).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        console.log(error);
        return res
            .json('Get history by id failed')
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
