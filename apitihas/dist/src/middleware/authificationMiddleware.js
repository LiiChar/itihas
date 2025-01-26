"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authificationMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authificationMiddleware = (req, res, next) => {
    try {
        let auth = req.headers.authorization;
        const cookiesAuth = req.cookies['token'];
        if (!auth && !cookiesAuth) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json({ error: 'User not authorized into system' });
        }
        else if (cookiesAuth) {
            auth = cookiesAuth;
        }
        else {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json({ error: 'User not authorized into system' });
        }
        const [_bearer, token] = auth.split(' ');
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret, {});
        if (typeof decoded == 'string') {
            const user = JSON.parse(decoded);
            req.body.user = user;
        }
        else {
            req.body.user = decoded;
        }
        next();
    }
    catch (e) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal Server Error' });
    }
};
exports.authificationMiddleware = authificationMiddleware;
