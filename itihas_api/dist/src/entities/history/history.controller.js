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
    const history = yield (0, history_service_1.getHistories)();
    return res.json(history).status(http_status_codes_1.StatusCodes.OK);
}));
historyRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = (yield db_1.db.query.users.findMany())[0];
    const history = yield (0, history_service_1.getHistory)(parseInt(id), user);
    return res.json(history).status(http_status_codes_1.StatusCodes.OK);
}));
