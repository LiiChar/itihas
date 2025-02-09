"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const http_status_codes_1 = require("http-status-codes");
class ErrorBoundary extends Error {
    constructor(message, code, log) {
        super(message);
        this.message = message;
        this.code = code;
    }
    ErrorResponse(response) {
        return response.json(this.message).status((0, http_status_codes_1.getStatusCode)(this.code));
    }
}
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=error.js.map