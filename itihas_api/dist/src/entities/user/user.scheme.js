"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSendNotification = exports.userChangeStatusScheme = exports.userUpdateSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.userRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.userLoginSchema = zod_1.z.object({
    name: zod_1.z.string(),
    password: zod_1.z.string().min(8),
});
exports.userUpdateSchema = zod_1.z.object({
    description: zod_1.z.string().nullable(),
    email: zod_1.z.string().email().nullable(),
    location: zod_1.z.string().nullable(),
    name: zod_1.z.string().nullable(),
    photo: zod_1.z.string().nullable(),
});
exports.userChangeStatusScheme = zod_1.z.object({
    role: zod_1.z.enum(['user', 'admin']),
});
exports.userSendNotification = zod_1.z.object({
    usersIdx: zod_1.z.array(zod_1.z.number()),
    content: zod_1.z.string(),
});
