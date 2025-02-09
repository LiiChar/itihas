"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = exports.getValueWithoutStaples = exports.getValueFromStaples = void 0;
const getValueFromStaples = (string, staple = ['(', ')']) => {
    const letfStapleIndex = string.indexOf(staple[0]) + 1;
    const rightStapleIndex = string.lastIndexOf(staple[1]);
    return string.slice(letfStapleIndex, rightStapleIndex);
};
exports.getValueFromStaples = getValueFromStaples;
const getValueWithoutStaples = (string, staple) => {
    const regex = new RegExp(`${staple.length === 1 ? staple : staple.join(' | ')}`, 'g');
    string = string.replace(regex, '');
    return string;
};
exports.getValueWithoutStaples = getValueWithoutStaples;
const replaceAll = (string, staple, value) => {
    const regex = new RegExp(`${staple.length === 1 ? staple : staple.join(' | ')}`, 'g');
    string = string.replace(regex, value);
    return string;
};
exports.replaceAll = replaceAll;
//# sourceMappingURL=string.js.map