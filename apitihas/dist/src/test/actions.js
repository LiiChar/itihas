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
exports.actionsTest = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../database/db");
const action_1 = require("../entities/page/lib/action");
const scheme_1 = require("../database/scheme");
const actionsTest = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield db_1.db.query.users.findMany())[0];
    const actions = 'set(name,50);var(hp,query(name););dif(hp,10);if({5,<,10}{var(page,10);}{var(page,5);});set(hp,page);move(get(page););';
    yield (0, action_1.executeAction)(1, user, actions);
    const variablesList = yield db_1.db.query.variables.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(scheme_1.variables.userId, user.id), (0, drizzle_orm_1.eq)(scheme_1.variables.historyId, 1)),
    });
});
exports.actionsTest = actionsTest;
