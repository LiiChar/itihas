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
exports.sendEmail = exports.emailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            type: 'login',
            user: `${process.env.MAILER_USER}`,
            pass: `${process.env.MAILER_PASS}`,
        },
    });
};
exports.emailTransporter = emailTransporter;
const sendEmail = (email, content, transporter) => __awaiter(void 0, void 0, void 0, function* () {
    let transport = transporter !== null && transporter !== void 0 ? transporter : (0, exports.emailTransporter)();
    const mailOptions = {
        from: process.env.MAILER_USER,
        to: email,
        subject: 'Подтвердите свою почту',
        text: '',
        html: `${content}`,
    };
    try {
        yield transport.sendMail(mailOptions);
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
exports.sendEmail = sendEmail;
