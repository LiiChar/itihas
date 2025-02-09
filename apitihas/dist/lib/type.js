"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeFromValue = void 0;
const getTypeFromValue = (data) => {
    if (Array.isArray(data)) {
        return 'array';
    }
    if (typeof data == 'object') {
        return 'object';
    }
    if (Number.isInteger(data)) {
        return 'number';
    }
    return 'string';
};
exports.getTypeFromValue = getTypeFromValue;
//# sourceMappingURL=type.js.map