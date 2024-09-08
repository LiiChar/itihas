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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatusUser = exports.sendNotification = exports.logoutUser = exports.getListUsers = exports.getFullUsers = exports.getUser = exports.removeUser = exports.updateUser = exports.verifyEmail = exports.registerUser = exports.loginUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../database/db");
const user_1 = require("./user");
const auth_1 = require("../../lib/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const mail_1 = require("../../lib/mail");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, name: username } = req.body;
    const userFind = yield db_1.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.name, username),
    });
    if (!userFind) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json('Users not found');
    }
    const isComparePassword = yield bcrypt_1.default.compare(userFind.password, password);
    if (!isComparePassword) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json('Password not equels');
    }
    const token = (0, auth_1.getJwtToken)(userFind);
    res.setHeader('authorization', token);
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        name: userFind.name,
        email: userFind.email,
        photo: userFind.photo,
        id: userFind.id,
        role: userFind.role,
    });
});
exports.loginUser = loginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email, name: username, } = req.body;
    const userFind = yield db_1.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.name, username),
    });
    if (userFind) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json('User exists');
    }
    const salt = yield bcrypt_1.default.genSalt(6);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = (yield db_1.db
        .insert(user_1.users)
        .values({
        name: username,
        email,
        password: hashedPassword,
    })
        .returning())[0];
    const token = (0, auth_1.getJwtToken)(user);
    // await sendVerifyEmail(email, token);
    res.setHeader('authorization', token);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: true,
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        name: user.name,
        email: user.email,
        photo: user.photo,
        id: user.id,
        role: user.role,
    });
});
exports.registerUser = registerUser;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.query.token;
    if (!token) {
        return res.json('Не пришёл токен').status(401);
    }
    const user = (0, auth_1.getUserFromToken)(token);
    yield db_1.db
        .update(user_1.users)
        .set({
        verify: true,
    })
        .where((0, drizzle_orm_1.eq)(user_1.users.id, user.id));
    res.setHeader('authorization', token);
    return res.redirect((_a = process.env.REDIRECT_URL) !== null && _a !== void 0 ? _a : 'google.com');
});
exports.verifyEmail = verifyEmail;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, email, location, name, photo, user, } = req.body;
    const id = req.query.id;
    if (!id) {
        return res
            .json('Не пришёл id')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    if (Number(id) != user.id || user.role != 'admin') {
        return res
            .json('У вам нет прав для изменения данного пользователя')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    const userUpdated = (yield db_1.db
        .update(user_1.users)
        .set({
        description,
        email,
        location,
        name: name !== null && name !== void 0 ? name : undefined,
        photo: photo !== null && photo !== void 0 ? photo : undefined,
    })
        .where((0, drizzle_orm_1.eq)(user_1.users.id, Number(id)))
        .returning())[0];
    const token = (0, auth_1.getJwtToken)(userUpdated);
    res.setHeader('authorization', token);
    return res.json('Пользователь успешно изменён');
});
exports.updateUser = updateUser;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, } = req.body;
    const id = req.query.id;
    if (!id) {
        return res
            .json('Не пришёл id')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    if (Number(id) != user.id || user.role != 'admin') {
        return res
            .json('У вам нет прав для изменения данного пользователя')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    yield db_1.db.delete(user_1.users).where((0, drizzle_orm_1.eq)(user_1.users.id, Number(id)));
    res.removeHeader('authorization');
    return res.json('Пользователь успешно изменён');
});
exports.removeUser = removeUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const user = yield db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_1.users.id, id),
    });
    return res.json(user);
});
exports.getUser = getUser;
const getFullUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.db.query.users.findMany({
        columns: {
            id: true,
            name: true,
            location: true,
            email: true,
            photo: true,
            role: true,
            description: true,
            createdAt: true,
        },
    });
    return res.json(users);
});
exports.getFullUsers = getFullUsers;
const getListUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.db.query.users.findMany({
        columns: {
            id: true,
            name: true,
            photo: true,
            createdAt: true,
        },
    });
    return res.json(users);
});
exports.getListUsers = getListUsers;
const logoutUser = (req, res) => {
    res.removeHeader('authorization');
    return res.json('Успешно вышли из аккаунта');
};
exports.logoutUser = logoutUser;
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usersIdx, user, content, } = req.body;
    if (user.role != 'admin') {
        return res
            .json('У вам нет прав для изменения данного пользователя')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    let userEmails = [];
    try {
        if (usersIdx.length > 0) {
            const promises = [];
            usersIdx.forEach(id => {
                const prom = db_1.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(user_1.users.id, Number(id)),
                    columns: {
                        email: true,
                    },
                });
                promises.push(prom);
            });
            userEmails = (yield Promise.all(promises)).map(em => em.email);
        }
        else {
            userEmails = (yield db_1.db.query.users.findMany({
                columns: {
                    email: true,
                },
            })).map(em => em.email);
        }
    }
    catch (error) {
        return res
            .json('Что-то пошло не так при отправке уведомлений')
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
    let emails = userEmails.reduce((acc, el) => {
        let transport = (0, mail_1.emailTransporter)();
        if (el) {
            const prom = (0, mail_1.sendEmail)(el, content, transport);
            acc.push(prom);
        }
        return acc;
    }, []);
    yield Promise.all(emails);
    return res.json('Уведомления успешно отправлены пользователям');
});
exports.sendNotification = sendNotification;
const changeStatusUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, user, } = req.body;
    const id = req.query.id;
    if (!id) {
        return res
            .json('Не пришёл id')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    if (user.role != 'admin') {
        return res
            .json('У вам нет прав для изменения статуса данного пользователя')
            .status(http_status_codes_1.StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);
    }
    const userUpdated = (yield db_1.db
        .update(user_1.users)
        .set({
        role: role,
    })
        .where((0, drizzle_orm_1.eq)(user_1.users.id, Number(id)))
        .returning())[0];
    const token = (0, auth_1.getJwtToken)(userUpdated);
    res.setHeader('authorization', token);
    return res.json('Статус пользователя успешно изменён');
});
exports.changeStatusUser = changeStatusUser;
