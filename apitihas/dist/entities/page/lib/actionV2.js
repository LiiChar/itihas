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
exports.run = exports.parse = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const page_1 = require("../model/page");
const type_1 = require("./type");
const error_1 = require("../../../lib/error");
const http_status_codes_1 = require("http-status-codes");
const parse = (input) => {
    let result = [];
    const stack = [];
    let currentToken = '';
    let position = 0;
    let nested = false;
    let isObjectOrArray = 0;
    for (let char of input) {
        if (char === '(') {
            nested = true;
            stack.push({
                token: currentToken,
                children: [],
                nested,
                position,
            });
            currentToken = '';
        }
        else if (char === ')') {
            if (currentToken) {
                stack[stack.length - 1].children.push(currentToken);
                currentToken = '';
            }
            const lastLevel = stack.pop();
            if (lastLevel && lastLevel.token) {
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(lastLevel);
                }
                else {
                    result.push(lastLevel);
                }
            }
            nested = false;
        }
        else if (char === ',') {
            if (isObjectOrArray > 0) {
                currentToken += char;
                continue;
            }
            // Запятая - разделитель значений
            if (currentToken) {
                stack[stack.length - 1].children.push(currentToken);
                currentToken = '';
            }
        }
        else if (char === ';') {
            position += 1;
            continue;
        }
        else {
            if (char === '{') {
                isObjectOrArray += 1;
                isObjectOrArray += 1;
            }
            else if (char === '}') {
                isObjectOrArray -= 1;
            }
            else if (char === '[') {
                isObjectOrArray += 1;
            }
            else if (char === ']') {
                isObjectOrArray -= 1;
            }
            currentToken += char; // Собираем текущий токен
        }
        position += 1;
    }
    // Обрабатываем оставшийся токен, если он существует
    if (currentToken) {
        if (stack.length > 0) {
            stack[stack.length - 1].children.push(currentToken);
        }
        else {
            result.push({
                token: currentToken,
                children: [],
                nested: nested,
                position,
            });
        }
    }
    result = result.map(t => {
        return changeStringToToken(t);
    });
    return result;
};
exports.parse = parse;
const changeStringToToken = (token) => {
    token.children.forEach((v, i) => {
        if (typeof v == 'string') {
            token.children[i] = {
                token: 'string',
                children: [v],
                nested: true,
                position: token.children[i - 1]
                    ? token.children[i - 1].position + v.length
                    : token.position + v.length,
            };
        }
        else {
            token.children[i] = changeStringToToken(v);
        }
    });
    return token;
};
const run = (tokens_1, child_1, user_1, id_1, varMap_1, ...args_1) => __awaiter(void 0, [tokens_1, child_1, user_1, id_1, varMap_1, ...args_1], void 0, function* (tokens, child, user, id, varMap, isReturn = false) {
    let pageIndex = 0;
    const vars = varMap !== null && varMap !== void 0 ? varMap : new Map();
    for (let i = child !== null && child !== void 0 ? child : 0; child ? child + 1 : i < tokens.length; i++) {
        const t = tokens[i];
        if (!t) {
            return;
        }
        if (t.token == 'move') {
            pageIndex = yield (0, exports.run)(t.children, 0, user, id, varMap, isReturn);
        }
        else if (t.token == 'var') {
            const value = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            const key = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            vars.set(key, value);
        }
        else if (t.token == 'get') {
            const key = yield (0, exports.run)(t.children, 0, user, id, varMap, isReturn);
            return vars.get(key);
        }
        else if (t.token == 'query') {
            const data = yield db_1.db.query.variables.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.userId, user.id), (0, drizzle_orm_1.eq)(page_1.variables.historyId, id), (0, drizzle_orm_1.eq)(page_1.variables.variable, (yield (0, exports.run)(t.children, 0, user, id, varMap, isReturn)))),
            });
            if (!data) {
                throw new error_1.ErrorBoundary(`action: query, selector: t.value, Not found variable by name`, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
            }
            return data.data;
        }
        else if (t.token == 'if') {
            const sign = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            let leftSide = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            const leftSideType = (0, type_1.getTypeString)(leftSide);
            leftSide = (0, type_1.getValueByType)(leftSide, leftSideType);
            let rightSide = yield (0, exports.run)(t.children, 2, user, id, vars, true);
            const rightSideType = (0, type_1.getTypeString)(leftSide);
            rightSide = (0, type_1.getValueByType)(rightSide, rightSideType);
            let isTrue;
            if (sign == '=') {
                isTrue = leftSide == rightSide;
            }
            else if (sign == '<') {
                isTrue = leftSide < rightSide;
            }
            else if (sign == '>') {
                isTrue = leftSide > rightSide;
            }
            else if (sign == '!=') {
                isTrue = leftSide != rightSide;
            }
            else if (sign == '<=') {
                isTrue = leftSide <= rightSide;
            }
            else if (sign == '>=') {
                isTrue = leftSide >= rightSide;
            }
            else {
                isTrue = true;
            }
            if (isTrue) {
                yield (0, exports.run)(t.children, 3, user, id, vars, true);
            }
            else {
                yield (0, exports.run)(t.children, 4, user, id, vars, true);
            }
        }
        else if (t.token == 'set') {
            const value = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            const key = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            let data = vars.has(value) ? vars.get(value) : value;
            if (Number.isInteger(data)) {
                data = `${data}`;
            }
            yield db_1.db
                .update(page_1.variables)
                .set({ data })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.userId, user.id), (0, drizzle_orm_1.eq)(page_1.variables.historyId, id), (0, drizzle_orm_1.eq)(page_1.variables.variable, key)));
        }
        else if (t.token == 'create') {
            const data = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            const type = yield (0, exports.run)(t.children, 2, user, id, vars, true);
            const variable = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            const variableData = {
                data,
                historyId: id,
                userId: user.id,
                type,
                variable,
            };
            yield db_1.db.insert(page_1.variables).values(variableData);
        }
        else if (t.token == 'sum') {
            const key = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            const first = vars.get(key);
            const second = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            if (isReturn) {
                return +first + +second;
            }
            vars.set(key, +first + +second);
        }
        else if (t.token == 'dif') {
            const key = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            const first = vars.get(key);
            const second = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            if (isReturn) {
                return +first - +second;
            }
            vars.set(key, +first - +second);
        }
        else if (t.token == 'mul') {
            const key = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            const first = vars.get(key);
            const second = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            if (isReturn) {
                return +first * +second;
            }
            vars.set(key, +first * +second);
        }
        else if (t.token == 'div') {
            const key = yield (0, exports.run)(t.children, 0, user, id, vars, true);
            const first = vars.get(key);
            const second = yield (0, exports.run)(t.children, 1, user, id, vars, true);
            if (isReturn) {
                return +first / +second;
            }
            vars.set(key, +first / +second);
        }
        else if (t.token == 'boolean') {
            return t.children[0];
        }
        else if (t.token == 'integer') {
            return t.children[0];
        }
        else if (t.token == 'string') {
            return t.children[0];
        }
    }
    return pageIndex;
});
exports.run = run;
//# sourceMappingURL=actionV2.js.map