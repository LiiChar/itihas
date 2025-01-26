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
exports.insertDataToString = exports.insertDataToContent = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const page_1 = require("../model/page");
const insertDataToContent = (content, historyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const variabs = yield db_1.db.query.variables.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.historyId, historyId), (0, drizzle_orm_1.eq)(page_1.variables.userId, userId)),
    });
    const mathchesVariable = Array.from(content.matchAll(/{=([^{}=]+)}/gm));
    let value = (0, exports.insertDataToString)(content, variabs, mathchesVariable);
    let mathchesVariableAgain = Array.from(value.matchAll(/{=([^{}=]+)}/gm));
    let countTry = 0;
    while (mathchesVariableAgain.length > 0 && countTry < 5) {
        value = (0, exports.insertDataToString)(value, variabs, mathchesVariableAgain);
        mathchesVariableAgain = Array.from(value.matchAll(/{=([^{}=]+)}/gm));
        countTry++;
    }
    return value;
});
exports.insertDataToContent = insertDataToContent;
const insertDataToString = (content, variabs, mathchesVariable) => {
    mathchesVariable.forEach(reg => {
        var _a, _b;
        const regex = new RegExp('{=' + reg[1] + '}', 'm');
        if (reg[1].includes('.')) {
            const nestedValue = reg[1].split('.');
            const variableSearch = variabs.find(ver => ver.variable == nestedValue.shift());
            if (variableSearch && variableSearch.data) {
                let parsedData = JSON.parse(variableSearch.data);
                nestedValue.forEach(v => {
                    if (Number.isInteger(v)) {
                        parsedData = parsedData[Math.trunc(+v)];
                    }
                    else {
                        parsedData = parsedData[v];
                    }
                });
                if (typeof parsedData == 'string') {
                    content = content.replace(regex, parsedData);
                }
            }
        }
        else {
            const variableSearch = (_b = (_a = variabs.find(ver => ver.variable == reg[1])) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : '';
            content = content.replace(regex, variableSearch);
        }
    });
    return content;
};
exports.insertDataToString = insertDataToString;
