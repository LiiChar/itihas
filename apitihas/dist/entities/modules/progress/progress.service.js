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
exports.getProgress = void 0;
const db_1 = require("../../../database/db");
const getProgress = (_a) => __awaiter(void 0, [_a], void 0, function* ({ historyId, pageId, userId, }) {
    const progreses = yield db_1.db.query.userHistoryProgreses.findMany({
        where: (progress, { eq, and }) => {
            let first;
            if (historyId) {
                first = eq(progress.historyId, historyId);
            }
            let second;
            if (pageId) {
                second = eq(progress.pageId, pageId);
            }
            let third;
            if (userId) {
                third = eq(progress.userId, userId);
            }
            return and(first, second, third);
        },
        with: {
            page: true,
            history: true,
            user: true,
            nextPage: true,
            prevPage: true,
        },
    });
    return progreses;
});
exports.getProgress = getProgress;
//# sourceMappingURL=progress.service.js.map