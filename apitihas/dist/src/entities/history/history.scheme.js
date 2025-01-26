"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagePointInsertScheme = exports.pageInsertSchema = void 0;
const zod_1 = require("zod");
exports.pageInsertSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    image: zod_1.z.string().nullable(),
    content: zod_1.z.string(),
    sound: zod_1.z.string().nullable(),
    minAge: zod_1.z.number().nullable(),
});
exports.pagePointInsertScheme = zod_1.z.object({
    name: zod_1.z.string(),
    action: zod_1.z.string(),
});
