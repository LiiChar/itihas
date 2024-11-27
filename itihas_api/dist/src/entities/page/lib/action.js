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
exports.executeAction = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const page_1 = require("../model/page");
const string_1 = require("./string");
const type_1 = require("./type");
const executeAction = (id, user, action) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = execute(action.trim());
    const pageId = yield run(tokens, user, id);
    return pageId;
});
exports.executeAction = executeAction;
let index = 0;
const valid = (str, { regex }) => {
    return regex.test(str);
};
const parse = (str, { regex }) => {
    var _a;
    console.log(str, regex);
    const exec = regex.exec(str);
    console.log(exec);
    const lastIndex = ((_a = exec[0]) !== null && _a !== void 0 ? _a : exec.input).length;
    index += lastIndex + 1;
    return [str.slice(lastIndex), str.slice(0, lastIndex)];
};
const REGEX = /\(([^)]+)\)/;
const token = [
    {
        regex: /^move\([a-zA-Z0-9А-Яа-я()\[\]{};,]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'move',
                index,
                value: data,
            };
        },
    },
    {
        regex: /^get\([a-zA-Z0-9А-Яа-я]*\);/,
        getToken: function (value) {
            const match = value.match(REGEX);
            return {
                type: 'get',
                index,
                value: match[1],
            };
        },
    },
    {
        regex: /^query\([a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const match = value.match(REGEX);
            return {
                type: 'query',
                index,
                value: match[1],
            };
        },
    },
    {
        regex: /^var\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'var',
                index,
                value: data.split(','),
            };
        },
    },
    {
        regex: /^dif\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'dif',
                index,
                value: data.split(','),
            };
        },
    },
    {
        regex: /^sum\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'sum',
                index,
                value: data.split(','),
            };
        },
    },
    {
        regex: /^div\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'div',
                index,
                value: data.split(','),
            };
        },
    },
    {
        regex: /^mul\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'mul',
                index,
                value: data.split(','),
            };
        },
    },
    {
        regex: /^set\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const match = value.matchAll(/\(([^)]+)\)/g);
            const values = [];
            for (const val of match) {
                values.push(val);
            }
            return {
                type: 'set',
                index,
                value: values[0][1].split(','),
            };
        },
    },
    {
        regex: /^create\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
        getToken: function (value) {
            const data = (0, string_1.getValueFromStaples)(value);
            return {
                type: 'create',
                index,
                value: data.split(','),
            };
        },
    },
    {
        regex: /^if\({[a-zA-Z0-9А-Яа-я()\[\];]*,(==|>|<|!=|=>|=<),[a-zA-Z0-9А-Яа-я();,]*}{[a-zA-Z0-9А-Яа-я();,]*}{[a-zA-Z0-9А-Яа-я()\[\];,]*}\);/,
        getToken: function (value) {
            const dataParsed = (0, string_1.replaceAll)(value, ['}{'], '::');
            const parsed = (0, string_1.getValueFromStaples)(dataParsed, ['{', '}']);
            const splited = parsed.split('::');
            const data = [...splited.shift().split(','), ...splited];
            return {
                type: 'if',
                index,
                value: data,
            };
        },
    },
    {
        regex: /^[0-9]*$/,
        getToken: function (value) {
            return {
                type: 'integer',
                index,
                value: value,
            };
        },
    },
    {
        regex: /^[a-zA-Z0-9А-Яа-я]*$/,
        getToken: function (value) {
            return {
                type: 'string',
                index,
                value: value,
            };
        },
    },
    {
        regex: /^(true|false)$/,
        getToken: function (value) {
            return {
                type: 'boolean',
                index,
                value: value,
            };
        },
    },
];
const execute = (str) => {
    let string = str;
    const tokens = [];
    while (string.length > 0) {
        token.forEach(t => {
            if (valid(string, t) && string.length > 0) {
                console.log('Start parse');
                const [newStr, value] = parse(string.trim(), t);
                str = string;
                string = newStr.trim();
                const token = t.getToken(value);
                tokens.push(token);
            }
        });
        if (str == string) {
            throw Error('Не удалост распарсить подходящий токен для кода - ' + string);
        }
    }
    return tokens;
};
const run = (tokens_1, user_1, id_1, varMap_1, ...args_1) => __awaiter(void 0, [tokens_1, user_1, id_1, varMap_1, ...args_1], void 0, function* (tokens, user, id, varMap, isReturn = false) {
    console.log(isReturn ? '' : 'Start run code');
    let pageIndex = 0;
    const vars = varMap !== null && varMap !== void 0 ? varMap : new Map();
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.type == 'move') {
            pageIndex = yield run(execute(t.value), user, id, vars, true);
        }
        else if (t.type == 'var') {
            const value = yield run(execute(t.value[1]), user, id, vars, true);
            vars.set(t.value[0], value);
        }
        else if (t.type == 'get') {
            return vars.get(t.value);
        }
        else if (t.type == 'query') {
            const data = yield db_1.db.query.variables.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.userId, user.id), (0, drizzle_orm_1.eq)(page_1.variables.historyId, id), (0, drizzle_orm_1.eq)(page_1.variables.variable, t.value)),
            });
            if (!data) {
                throw Error('action: query, selector: t.value, Not found variable by name');
            }
            return data.data;
        }
        else if (t.type == 'if') {
            const sign = t.value[1];
            let leftSide = yield run(execute(t.value[0]), user, id, vars, true);
            const leftSideType = (0, type_1.getTypeString)(leftSide);
            leftSide = (0, type_1.getValueByType)(leftSide, leftSideType);
            let rightSide = yield run(execute(t.value[2]), user, id, vars, true);
            const rightSideType = (0, type_1.getTypeString)(leftSide);
            rightSide = (0, type_1.getValueByType)(rightSide, rightSideType);
            const ifAction = t.value[3];
            const elseAction = t.value[4];
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
                yield run(execute(ifAction), user, id, vars, true);
            }
            else {
                yield run(execute(elseAction), user, id, vars, true);
            }
        }
        else if (t.type == 'set') {
            const data = vars.has(t.value[1]) ? vars.get(t.value[1]) : t.value[1];
            yield db_1.db
                .update(page_1.variables)
                .set({ data })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.variables.userId, user.id), (0, drizzle_orm_1.eq)(page_1.variables.historyId, id), (0, drizzle_orm_1.eq)(page_1.variables.variable, t.value[0])));
        }
        else if (t.type == 'create') {
            const variableData = {
                data: t.value[1],
                historyId: id,
                userId: user.id,
                type: t.value[2],
                variable: t.value[0],
            };
            yield db_1.db.insert(page_1.variables).values(variableData);
        }
        else if (t.type == 'sum') {
            const first = vars.get(t.value[0]);
            const second = yield run(execute(t.value[1]), user, id, vars, true);
            if (isReturn) {
                return +first + +second;
            }
            vars.set(t.value[0], +first + +second);
        }
        else if (t.type == 'dif') {
            const first = vars.get(t.value[0]);
            const second = yield run(execute(t.value[1]), user, id, vars, true);
            if (isReturn) {
                return +first - +second;
            }
            vars.set(t.value[0], +first - +second);
        }
        else if (t.type == 'mul') {
            const first = vars.get(t.value[0]);
            const second = yield run(execute(t.value[1]), user, id, vars, true);
            if (isReturn) {
                return +first * +second;
            }
            vars.set(t.value[0], +first * +second);
        }
        else if (t.type == 'div') {
            const first = vars.get(t.value[0]);
            const second = yield run(execute(t.value[1]), user, id, vars, true);
            if (isReturn) {
                return +first / +second;
            }
            vars.set(t.value[0], +first / +second);
        }
        else if (t.type == 'boolean') {
            return t.value;
        }
        else if (t.type == 'integer') {
            return t.value;
        }
        else if (t.type == 'string') {
            return t.value;
        }
    }
    return pageIndex;
});
