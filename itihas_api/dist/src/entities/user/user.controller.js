"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_service_1 = require("./user.service");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const user_scheme_1 = require("./user.scheme");
const authificationMiddleware_1 = require("../../middleware/authificationMiddleware");
const roleMiddleware_1 = require("../../middleware/roleMiddleware");
const auth_1 = require("../../lib/auth");
const db_1 = require("../../database/db");
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = require("./model/user");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post('/login', (0, validationMiddleware_1.validateData)(user_scheme_1.userLoginSchema), user_service_1.loginUser);
userRouter.post('/register', (0, validationMiddleware_1.validateData)(user_scheme_1.userRegistrationSchema), user_service_1.registerUser);
userRouter.get('/authicated', (req, res) => {
    console.log(req.cookies['token']);
    const token = req.cookies['token'];
    if (!token)
        return res.json(false);
    const payload = (0, auth_1.getPayloadByToken)(token);
    const user = db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_1.users.id, payload.id),
    });
    if (!user)
        return res.json(false);
    res.json(true);
});
userRouter.get('/verify', user_service_1.verifyEmail);
userRouter.put('/update', authificationMiddleware_1.authificationMiddleware, user_service_1.updateUser);
userRouter.delete('/', authificationMiddleware_1.authificationMiddleware, user_service_1.removeUser);
userRouter.get('/:id', user_service_1.getUser);
userRouter.get('/', user_service_1.getFullUsers);
userRouter.get('/list', user_service_1.getListUsers);
userRouter.put('/status', (0, roleMiddleware_1.roleMiddleware)('admin'), user_service_1.changeStatusUser);
userRouter.post('/notification', authificationMiddleware_1.authificationMiddleware, (0, roleMiddleware_1.roleMiddleware)('admin'), user_service_1.sendNotification);
