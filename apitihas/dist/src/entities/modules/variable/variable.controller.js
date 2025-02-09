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
exports.variableRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const variable_service_1 = require("./variable.service");
const variableRouter = (0, express_1.Router)();
exports.variableRouter = variableRouter;
variableRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { history, user } = req.query;
    const data = req.body;
    const varableValues = yield (0, variable_service_1.setVaribles)(data, +history, +user);
    return res.json(varableValues).status(http_status_codes_1.StatusCodes.OK);
}));
variableRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { history, user } = req.query;
        if (!history && !user) {
            return res.json('Не пришли параметры').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const varableValues = yield (0, variable_service_1.getVariables)(+history, +user);
        return res.json(varableValues).status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.json(error.message).status(500);
        }
    }
}));
variableRouter.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.query.user;
    if (!user) {
        return res.json('Не пришли параметры').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const varableValues = yield (0, variable_service_1.getVariablesByUser)(+user);
    return res.json(varableValues).status(http_status_codes_1.StatusCodes.OK);
}));
variableRouter.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const history = req.query.history;
    if (!history) {
        return res.json('Не пришли параметры').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const varableValues = yield (0, variable_service_1.getVariableshistory)(+history);
    return res.json(varableValues).status(http_status_codes_1.StatusCodes.OK);
}));
