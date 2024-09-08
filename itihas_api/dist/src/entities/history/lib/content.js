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
exports.insertDataToContent = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const page_1 = require("../../page/model/page");
const insertDataToContent = (content, historyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const variabs = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId), (0, drizzle_orm_1.eq)(page_1.variables.userId, userId)),
    });
    const mathchesVariable = Array.from(content.matchAll(/{=(.*?)}/gm));
    mathchesVariable.forEach(reg => {
        var _a, _b;
        const regex = new RegExp('{=' + reg[1] + '}', 'gm');
        const variableSearch = (_b = (_a = variabs.find(ver => ver.variable == reg[1])) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : 'такого значения нет';
        content = content.replace(/{=name}/gm, variableSearch);
    });
    return content;
});
exports.insertDataToContent = insertDataToContent;
