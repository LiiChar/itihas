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
exports.getVariableshistory = exports.getVariablesByUser = exports.getVariables = exports.setVaribles = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const page_1 = require("../../page/model/page");
const error_1 = require("../../../lib/error");
const http_status_codes_1 = require("http-status-codes");
const type_1 = require("../../../lib/type");
const setVaribles = (data, historyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = Object.keys(data);
    const requests = [];
    const sqls = [];
    if (!historyId && !userId) {
        throw new error_1.ErrorBoundary('', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    if (historyId) {
        sqls.push((0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId));
    }
    if (userId) {
        sqls.push((0, drizzle_orm_1.eq)(page_1.variables.userId, userId));
    }
    const variablesArray = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.and)(...sqls),
    });
    keys.forEach((k) => __awaiter(void 0, void 0, void 0, function* () {
        const exist = variablesArray.find(v => v.variable == k);
        if (exist) {
            const req = db_1.db
                .update(page_1.variables)
                .set({ variable: data[k].key, data: data[k].data })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.variable, k), ...sqls));
            requests.push(req);
        }
        else {
            const value = {
                variable: data[k].key,
                data: data[k].data,
                historyId: historyId,
                type: (0, type_1.getTypeFromValue)(data[k].data),
                userId: userId,
            };
            const req = db_1.db.insert(page_1.variables).values(value);
            requests.push(req);
        }
    }));
    yield Promise.all(requests);
    return true;
});
exports.setVaribles = setVaribles;
const getVariables = (historyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const variablesData = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId), (0, drizzle_orm_1.eq)(page_1.variables.userId, userId)),
        with: {
            history: true,
        },
    });
    return variablesData;
});
exports.getVariables = getVariables;
const getVariablesByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const variablesData = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.eq)(page_1.variables.userId, userId),
        with: {
            history: true,
        },
    });
    return variablesData;
});
exports.getVariablesByUser = getVariablesByUser;
const getVariableshistory = (historyId) => __awaiter(void 0, void 0, void 0, function* () {
    const variablesData = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId),
        with: {
            history: true,
        },
    });
    return variablesData;
});
exports.getVariableshistory = getVariableshistory;