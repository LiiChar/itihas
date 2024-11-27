"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomRangeInt = void 0;
const randomRangeInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomRangeInt = randomRangeInt;
