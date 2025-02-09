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
exports.updateSimilarHistoryRate = exports.addSimilarHistory = exports.getSimilarHistory = exports.updateCommentsCommentHistory = exports.updateCommentHistory = exports.updateLikeHistory = exports.updateHistory = exports.updateLayout = exports.getLayouts = exports.getHistories = exports.createHistory = exports.getHistory = void 0;
const db_1 = require("../../database/db");
const content_1 = require("./lib/content");
const drizzle_orm_1 = require("drizzle-orm");
const history_1 = require("./model/history");
const error_1 = require("../../lib/error");
const http_status_codes_1 = require("http-status-codes");
const page_1 = require("../page/model/page");
const getHistory = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield db_1.db.query.histories.findFirst({
        extras: {
            views: (0, drizzle_orm_1.sql) `lower(0)`.as('views'),
        },
        where: (histories, { eq }) => eq(histories.id, id),
        with: {
            author: true,
            characters: true,
            likes: true,
            comments: {
                with: {
                    user: true,
                    likes: true,
                    comments: {
                        with: {},
                    },
                },
                orderBy: (histories, { desc }) => [desc(histories.createdAt)],
            },
            similarHistories: {
                with: {
                    similarHistory: true,
                },
                orderBy: (sim, { desc }) => [desc(sim.similar)],
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
            layout: true,
        },
    });
    if (!history) {
        throw Error('Не найдено истории по id ' + id);
    }
    const similar = yield db_1.db.query.similarHistories.findMany({
        where: (similar, { eq }) => eq(similar.historyId, history.id),
        with: {
            similarHistory: true,
        },
    });
    history.similarHistories = [...history.similarHistories, ...similar];
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
        const orderType = {
            asc: drizzle_orm_1.asc,
            desc: drizzle_orm_1.desc,
        };
        (_a = params.orders) === null || _a === void 0 ? void 0 : _a.forEach(({ field, order }) => {
            const action = orderType[order];
            const column = table[field];
            if (!action && !column)
                return;
            orderResult.push(action(column));
        });
        return orderResult;
    };
    let historiesFiltered = yield db_1.db.query.histories.findMany({
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
        historiesFiltered = historiesFiltered.filter(h => {
            let allow = true;
            params.genres.forEach(g => {
                const isFinded = !!h.genres.find((ig) => ig.genre.name === g.genre);
                allow = isFinded == true && g.allow == 'true' ? true : false;
            });
            return allow;
        });
    }
    return historiesFiltered;
});
exports.getHistories = getHistories;
const getLayouts = () => __awaiter(void 0, void 0, void 0, function* () {
    let layouts = yield db_1.db.query.layouts.findMany();
    layouts = layouts.map(l => {
        if (!Array.isArray(l.layout)) {
            l.layout = JSON.parse(l.layout);
        }
        return l;
    });
    return layouts;
});
exports.getLayouts = getLayouts;
const updateLayout = (userId, layoutId, layoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const existLayout = yield db_1.db.query.layouts.findFirst({
        where: (0, drizzle_orm_1.eq)(page_1.layouts.id, layoutId),
    });
    if (!existLayout) {
        throw new error_1.ErrorBoundary(`Layout by id ${layoutId} not exist`, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    if (userId != existLayout.userId) {
        let newDataLayout = Object.assign(existLayout, layoutData);
        newDataLayout.id = null;
        const createdLayout = yield db_1.db
            .insert(page_1.layouts)
            .values(newDataLayout)
            .returning();
        yield db_1.db.update(history_1.histories).set({
            layoutId: createdLayout[0].id,
        });
        return createdLayout[0];
    }
    const updatedLayout = yield db_1.db
        .update(page_1.layouts)
        .set(layoutData)
        .where((0, drizzle_orm_1.eq)(page_1.layouts.id, layoutId))
        .returning();
    return updatedLayout[0];
});
exports.updateLayout = updateLayout;
const updateHistory = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedHistory = yield db_1.db
        .update(history_1.histories)
        .set(updatedData)
        .where((0, drizzle_orm_1.eq)(history_1.histories.id, id))
        .returning();
    return updatedHistory[0];
});
exports.updateHistory = updateHistory;
const updateLikeHistory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const likes = yield db_1.db.query.likesToHistories.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_1.likesToHistories.historyId, data.historyId), (0, drizzle_orm_1.eq)(history_1.likesToHistories.userId, data.userId)),
    });
    if (likes) {
        yield db_1.db
            .delete(history_1.likesToHistories)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_1.likesToHistories.historyId, data.historyId), (0, drizzle_orm_1.eq)(history_1.likesToHistories.userId, data.userId)));
        if (likes.variant == data.variant) {
            return;
        }
    }
    const like = yield db_1.db.insert(history_1.likesToHistories).values(data).returning();
    return like;
});
exports.updateLikeHistory = updateLikeHistory;
const updateCommentHistory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const likes = yield db_1.db.query.likeToComments.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_1.likeToComments.commentId, data.commentId), (0, drizzle_orm_1.eq)(history_1.likeToComments.userId, data.userId)),
    });
    if (likes) {
        yield db_1.db
            .delete(history_1.likeToComments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_1.likeToComments.commentId, data.commentId), (0, drizzle_orm_1.eq)(history_1.likeToComments.userId, data.userId)));
        if (likes.variant == data.variant) {
            return;
        }
    }
    const like = yield db_1.db.insert(history_1.likeToComments).values(data).returning();
    return like;
});
exports.updateCommentHistory = updateCommentHistory;
const updateCommentsCommentHistory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const likes = yield db_1.db.query.likeToCommentComments.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_1.likeToCommentComments.commentsCommentId, data.commentsCommentId), (0, drizzle_orm_1.eq)(history_1.likeToCommentComments.userId, data.userId)),
    });
    if (likes) {
        yield db_1.db
            .delete(history_1.likeToCommentComments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_1.likeToCommentComments.commentsCommentId, data.commentsCommentId), (0, drizzle_orm_1.eq)(history_1.likeToCommentComments.userId, data.userId)));
        if (likes.variant == data.variant) {
            return;
        }
    }
    const like = yield db_1.db.insert(history_1.likeToCommentComments).values(data).returning();
    return like;
});
exports.updateCommentsCommentHistory = updateCommentsCommentHistory;
const getSimilarHistory = (historyId) => __awaiter(void 0, void 0, void 0, function* () {
    const similars = yield db_1.db.query.similarHistories.findMany({
        where: (0, drizzle_orm_1.eq)(history_1.similarHistories.historyId, historyId),
        with: {
            history: true,
            similarHistory: true,
        },
    });
    return similars;
});
exports.getSimilarHistory = getSimilarHistory;
const addSimilarHistory = (similar) => __awaiter(void 0, void 0, void 0, function* () {
    const createdSimilar = yield db_1.db
        .insert(history_1.similarHistories)
        .values(similar)
        .returning();
    return createdSimilar[0];
});
exports.addSimilarHistory = addSimilarHistory;
const updateSimilarHistoryRate = (_a) => __awaiter(void 0, [_a], void 0, function* ({ rate, similarId, }) {
    const updatedSimilar = yield db_1.db
        .update(history_1.similarHistories)
        .set({ similar: rate })
        .where((0, drizzle_orm_1.eq)(history_1.similarHistories.id, similarId))
        .returning();
    return updatedSimilar[0];
});
exports.updateSimilarHistoryRate = updateSimilarHistoryRate;
