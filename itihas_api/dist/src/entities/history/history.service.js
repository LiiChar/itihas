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
exports.getHistories = exports.getHistory = void 0;
const db_1 = require("../../database/db");
const content_1 = require("./lib/content");
const drizzle_orm_1 = require("drizzle-orm");
const getHistory = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield db_1.db.query.histories.findFirst({
        extras: {
            views: (0, drizzle_orm_1.sql) `lower(0)`.as('views'),
        },
        where: (histories, { eq }) => eq(histories.id, id),
        with: {
            author: true,
            comments: {
                with: {
                    user: true,
                    comments: {
                        with: {},
                    },
                },
            },
            similarHistories: {
                with: {
                    similarHistory: true,
                },
            },
            points: true,
            bookmarks: {
                with: {
                    bookmark: true,
                },
            },
            pages: {
                with: {
                    points: true,
                },
            },
            genres: {
                with: {
                    genre: true,
                },
            },
        },
    });
    if (!history) {
        throw Error('Не найдено истории по id ' + id);
    }
    const promises = history.pages.reduce((acc, page) => {
        history['views'] = +history['views'] + page.views;
        acc.push((0, content_1.insertDataToContent)(page.content, history.id, user.id));
        return acc;
    }, []);
    const contents = yield Promise.all(promises);
    contents.forEach((c, i) => {
        history.pages[i].content = c;
    });
    return history;
});
exports.getHistory = getHistory;
const getHistories = () => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield db_1.db.query.histories.findMany({
        with: {
            genres: {
                with: {
                    genre: true,
                },
                limit: 1,
            },
        },
    });
    return histories;
});
exports.getHistories = getHistories;
