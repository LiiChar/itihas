"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyString = exports.replaceAll = void 0;
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
exports.replaceAll = replaceAll;
const multiplyString = (str, count, separator) => {
    let value = '';
    for (let i = 0; i < count; i++) {
        value += str + separator;
    }
    return value;
};
exports.multiplyString = multiplyString;
