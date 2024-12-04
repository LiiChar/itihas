"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = void 0;
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
exports.replaceAll = replaceAll;
