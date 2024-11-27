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
exports.getLayouts = exports.getHistories = exports.createHistory = exports.getHistory = void 0;
const db_1 = require("../../database/db");
const content_1 = require("./lib/content");
const drizzle_orm_1 = require("drizzle-orm");
const history_1 = require("./model/history");
const error_1 = require("../../lib/error");
const http_status_codes_1 = require("http-status-codes");
const getHistory = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield db_1.db.query.histories.findFirst({
        extras: {
            views: (0, drizzle_orm_1.sql) `lower(0)`.as('views'),
        },
        where: (histories, { eq }) => eq(histories.id, id),
        with: {
            author: true,
            characters: true,
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
const createHistory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existHistory = yield db_1.db.query.histories.findFirst({
        where: (0, drizzle_orm_1.eq)(history_1.histories.name, data.name),
    });
    if (existHistory) {
        throw new error_1.ErrorBoundary('История с таким названием уже существует', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const history = yield db_1.db.insert(history_1.histories).values(data).returning();
    return history[0];
});
exports.createHistory = createHistory;
const getHistories = (params) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO
    function buildWhereClause(filters, table) {
        const replacesField = {
            genre: 'name',
        };
        const buildFilter = (filter) => {
            var _a;
            const parts = [];
            if (filter.field && filter.value && filter.operator) {
                const field = (_a = replacesField[filter.field]) !== null && _a !== void 0 ? _a : filter.field;
                if (!(field in table)) {
                    throw new error_1.ErrorBoundary(`Filed ${field} not exist in table`, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
                }
                parts.push((0, drizzle_orm_1.sql) `${table[field]} ${drizzle_orm_1.sql.raw(filter.operator)} '${drizzle_orm_1.sql.raw(filter.value)}'`);
            }
            if (filter.innerFilters && filter.innerFilters.length > 0) {
                const innerParts = filter.innerFilters.map(innerFilter => buildFilter(innerFilter));
                const conjunction = filter.variant === 'or' ? 'OR' : 'AND';
                parts.push(drizzle_orm_1.sql.join(innerParts, drizzle_orm_1.sql.raw(` ${conjunction} `)));
            }
            return drizzle_orm_1.sql.join(parts, drizzle_orm_1.sql.raw(' '));
        };
        return drizzle_orm_1.sql.join(filters.map(filter => buildFilter(filter)), drizzle_orm_1.sql.raw(' AND '));
    }
    const whereBuilder = (table) => {
        if (!params.filter) {
            return undefined;
        }
        return buildWhereClause(params.filter, table);
    };
    const orderBuilder = (table) => {
        var _a;
        const orderResult = [];
        (_a = params.orders) === null || _a === void 0 ? void 0 : _a.forEach(({ field, order }) => {
            const orderType = {
                asc: drizzle_orm_1.asc,
                desc: drizzle_orm_1.desc,
            };
            orderResult.push(orderType[order](table[field]));
        });
        return orderResult;
    };
    let histories = yield db_1.db.query.histories.findMany({
        with: {
            genres: {
                with: {
                    genre: true,
                },
            },
        },
        limit: params.limit,
        offset: params.offset,
        orderBy: history => orderBuilder(history),
        where: history => whereBuilder(history),
    });
    if (params.genres && params.genres.length > 0) {
        histories = histories.filter(h => {
            let allow = true;
            params.genres.forEach(g => {
                const isFinded = !!h.genres.find(ig => ig.genre.name === g.genre);
                allow = isFinded == true && g.allow == 'true' ? true : false;
            });
            return allow;
        });
    }
    return histories;
});
exports.getHistories = getHistories;
const getLayouts = () => __awaiter(void 0, void 0, void 0, function* () {
    const layouts = yield db_1.db.query.layouts.findMany();
    return layouts;
});
exports.getLayouts = getLayouts;
