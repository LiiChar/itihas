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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifiactionRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const notification_service_1 = require("./notification.service");
const notifiactionRouter = (0, express_1.Router)();
exports.notifiactionRouter = notifiactionRouter;
notifiactionRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.query.user_id) !== null && _a !== void 0 ? _a : req.cookies.user.id;
    if (!userId) {
        return res.json('Id not exist in request').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const notification = yield (0, notification_service_1.getNotification)(userId);
    return res.json(notification);
}));
