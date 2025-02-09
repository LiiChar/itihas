"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueByType = exports.getTypeString = void 0;
const getTypeString = (string) => {
    const firstChar = string[0];
    const lastChar = string[string.length - 1];
    if (string === 'true' || string === 'false')
        return 'boolean';
    if (string === 'null')
        return 'null';
    if (string === 'undefined')
        return 'undefined';
    const num = Number(string);
    if (!isNaN(num))
        return 'integer';
    if (firstChar === '[' && lastChar === ']')
        return 'array';
    if (firstChar === '{' && lastChar === '}')
        return 'object';
    return 'string';
};
exports.getTypeString = getTypeString;
const getValueByType = (string, type) => {
    if (type == 'integer') {
        return +string;
    }
    else if (type == 'boolean') {
        return string == 'true' ? true : false;
    }
    else {
        return string;
    }
};
exports.getValueByType = getValueByType;
//# sourceMappingURL=type.js.map