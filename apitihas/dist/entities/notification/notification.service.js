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
exports.getNotification = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const notification_1 = require("./model/notification");
const getNotification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield db_1.db.query.notificationEventsToUsers.findMany({
        where: (0, drizzle_orm_1.eq)(notification_1.notificationEventsToUsers.userId, userId),
        with: {
            notification: true,
        },
    });
    return notification;
});
exports.getNotification = getNotification;
//# sourceMappingURL=notification.service.js.map