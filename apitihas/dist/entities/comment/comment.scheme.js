"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyInsertSchema = exports.commentInsertSchema = void 0;
const zod_1 = require("zod");
exports.commentInsertSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    historyId: zod_1.z.number(),
    content: zod_1.z.string(),
});
exports.replyInsertSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    commentId: zod_1.z.number(),
    content: zod_1.z.string(),
});
//# sourceMappingURL=comment.scheme.js.map