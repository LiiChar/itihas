"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkHistoryInsertSchema = exports.bookmarkInsertSchema = void 0;
const zod_1 = require("zod");
exports.bookmarkInsertSchema = zod_1.z.object({
    name: zod_1.z.string(),
    userId: zod_1.z.number(),
});
exports.bookmarkHistoryInsertSchema = zod_1.z.object({
    historyId: zod_1.z.number(),
    bookmarkId: zod_1.z.number(),
});
//# sourceMappingURL=bookmark.scheme.js.map