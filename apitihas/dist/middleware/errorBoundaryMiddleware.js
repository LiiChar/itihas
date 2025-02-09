"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorBoundaryMiddleware = void 0;
const error_1 = require("../lib/error");
const http_status_codes_1 = require("http-status-codes");
const errorBoundaryMiddleware = (req, res, next) => {
    try {
        next();
    }
    catch (e) {
        if (e instanceof error_1.ErrorBoundary) {
            return e.ErrorResponse(res);
        }
        if (e instanceof Error) {
            return res
                .json('Server failed send responce')
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.errorBoundaryMiddleware = errorBoundaryMiddleware;
//# sourceMappingURL=errorBoundaryMiddleware.js.map