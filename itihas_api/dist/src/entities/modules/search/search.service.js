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
exports.search = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const history_1 = require("../../history/model/history");
const page_1 = require("../../page/model/page");
const search = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const searchedValue = {};
    const historySearched = yield db_1.db.query.histories.findMany({
        where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(history_1.histories.name, `%${search}%`), (0, drizzle_orm_1.like)(history_1.histories.description, `%${search}%`)),
    });
    searchedValue.history = historySearched;
    const pagesSearched = yield db_1.db.query.pages.findMany({
        where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(page_1.pages.name, `%${search}%`), (0, drizzle_orm_1.like)(page_1.pages.description, `%${search}%`)),
    });
    searchedValue.page = pagesSearched;
    return searchedValue;
});
exports.search = search;
