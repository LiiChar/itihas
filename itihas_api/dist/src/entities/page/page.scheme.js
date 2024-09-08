"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagePointInsertScheme = exports.pageInsertSchema = void 0;
const zod_1 = require("zod");
exports.pageInsertSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    action: zod_1.z.string(),
    image: zod_1.z.string().url().nullable(),
    content: zod_1.z.string(),
    sound: zod_1.z.string().url().nullable(),
});
exports.pagePointInsertScheme = zod_1.z.object({
    name: zod_1.z.string(),
    action: zod_1.z.string(),
    script: zod_1.z.string(),
});
