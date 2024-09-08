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
exports.sendVerifyEmail = exports.getUserFromToken = exports.getJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("./mail");
const getJwtToken = (user) => {
    var _a;
    const token = jsonwebtoken_1.default.sign(user, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'itihas');
    return token;
};
exports.getJwtToken = getJwtToken;
const getUserFromToken = (token) => {
    const user = jsonwebtoken_1.default.decode(token);
    return user;
};
exports.getUserFromToken = getUserFromToken;
const sendVerifyEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${process.env.BASE_URL}/user/verify?token=${token}`;
    const mailOptions = {
        from: process.env.MAILER_USER,
        to: email,
        subject: 'Подтвердите свою почту',
        text: '',
        html: `Пожалуйста нажмине на ссылку: <a href="${verificationUrl}">Подтвердите свою почту</a>`,
    };
    try {
        yield (0, mail_1.emailTransporter)().sendMail(mailOptions);
    }
    catch (error) {
        if (error &&
            typeof error == 'object' &&
            'response' in error &&
            typeof error.response == 'string') {
            throw new Error(error.response);
        }
    }
});
exports.sendVerifyEmail = sendVerifyEmail;
