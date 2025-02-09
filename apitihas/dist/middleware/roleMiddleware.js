"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roleMiddleware = (role) => {
    return (req, res, next) => {
        try {
            const auth = req.headers.authorization;
            if (!auth) {
                return res
                    .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .json({ error: 'Internal Server Error' });
            }
            const [bearer, token] = auth.split(' ');
            const secret = process.env.JWT_SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, secret, {});
            if (typeof decoded == 'string') {
                const user = JSON.parse(decoded);
                if (user.role == role) {
                    next();
                }
                else {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ error: 'Internal Server Error' });
                }
            }
            else {
                return res
                    .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .json({ error: 'Internal Server Error' });
            }
        }
        catch (e) {
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Internal Server Error' });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=roleMiddleware.js.map