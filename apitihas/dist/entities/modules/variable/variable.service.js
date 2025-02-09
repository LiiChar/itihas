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
const user_1 = require("../../user/model/user");
const history_1 = require("../../history/model/history");
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
        var _a, _b, _c;
        const exist = variablesArray.find(v => v.variable == k);
        if (exist) {
            const req = db_1.db
                .update(page_1.variables)
                .set({
                variable: data[k].key,
                data: data[k].data,
                type: (_a = data[k]) === null || _a === void 0 ? void 0 : _a.type,
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.variable, k), ...sqls));
            requests.push(req);
        }
        else {
            const value = {
                variable: data[k].key,
                data: data[k].data,
                historyId: historyId,
                type: (_c = (_b = data[k]) === null || _b === void 0 ? void 0 : _b.type) !== null && _c !== void 0 ? _c : (0, type_1.getTypeFromValue)(data[k].data),
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
    const user = yield db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_1.users.id, userId),
    });
    if (!user) {
        throw new error_1.ErrorBoundary('Пользователя не существует', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const history = yield db_1.db.query.histories.findFirst({
        where: (0, drizzle_orm_1.eq)(history_1.histories.id, historyId),
    });
    if (!history) {
        throw new error_1.ErrorBoundary('Истории не существует', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    if (history.authorId == userId) {
        const variable = yield db_1.db.query.variables.findMany({
            where: (0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId),
        });
        return variable;
    }
    const variablesData = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId), (0, drizzle_orm_1.eq)(page_1.variables.userId, userId)),
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
//# sourceMappingURL=variable.service.js.map