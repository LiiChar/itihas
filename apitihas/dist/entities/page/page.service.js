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
exports.updateLayoutPage = exports.getPages = exports.getPage = exports.getPageList = exports.createPagePoint = exports.updatePage = exports.createPage = exports.executeActionPage = exports.updateAction = exports.deleteActionById = exports.runCode = exports.getCurrentPageByHistoryId = void 0;
const db_1 = require("../../database/db");
const content_1 = require("./lib/content");
const drizzle_orm_1 = require("drizzle-orm");
const page_1 = require("./model/page");
const actionV2_1 = require("./lib/actionV2");
const string_1 = require("../../lib/string");
const error_1 = require("../../lib/error");
const user_1 = require("../user/model/user");
const http_status_codes_1 = require("http-status-codes");
const getCurrentPageByHistoryId = (historyId, pageId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = yield db_1.db.query.pages.findFirst({
        where: (0, drizzle_orm_1.eq)(page_1.pages.id, pageId),
    });
    const userProgress = yield db_1.db.query.userHistoryProgreses.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.userId, user.id), (0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.historyId, historyId)),
        orderBy: (userHistoryProgreses, { desc }) => [
            desc(userHistoryProgreses.completedAt),
        ],
    });
    if (!currentPage && pageId != 0 && userProgress) {
        throw new error_1.ErrorBoundary('Page not exist in story', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    let page = yield db_1.db.query.pages.findFirst({
        where: (pages, { eq, and }) => {
            let ex;
            if (!userProgress) {
                ex = eq(pages.type, 'start');
            }
            else if (pageId != 0) {
                ex = eq(pages.id, pageId);
            }
            else {
                ex = eq(pages.id, userProgress.pageId);
            }
            return and(ex, eq(pages.historyId, historyId));
        },
        with: {
            points: true,
            history: {
                with: {
                    layout: true,
                },
            },
            layout: true,
        },
    });
    if (!page) {
        page = yield db_1.db.query.pages.findFirst({
            where: (pages, { eq }) => eq(pages.historyId, historyId),
            orderBy: (pages, { asc }) => [asc(pages.id)],
            with: {
                points: true,
                history: {
                    with: {
                        layout: true,
                    },
                },
                layout: true,
            },
        });
    }
    if (!page) {
        throw new error_1.ErrorBoundary(`Не найдено главы по id ${currentPage}`, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const variables = yield db_1.db.query.variables.findMany({
        where: (variables, { eq, and }) => and(eq(variables.historyId, historyId), eq(variables.userId, user.id)),
    });
    let pagesWithVariables = Object.assign(page, { variables });
    try {
        pagesWithVariables['content'] = yield (0, content_1.insertDataToContent)(page.content, historyId, user.id);
    }
    catch (error) {
        throw new error_1.ErrorBoundary('Insert data failed', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    if (pagesWithVariables.layoutId == null &&
        pagesWithVariables.layout == null) {
        pagesWithVariables.layout = pagesWithVariables.history.layout;
    }
    if (pagesWithVariables.layout) {
        if (typeof pagesWithVariables.layout.layout == 'string') {
            pagesWithVariables.layout.layout = JSON.parse(pagesWithVariables.layout.layout);
        }
        const promises = pagesWithVariables.layout.layout.reduce((acc, p) => {
            acc.push(p.content
                ? (0, content_1.insertDataToContent)(p.content, pagesWithVariables.historyId, user.id)
                : p.content);
            return acc;
        }, []);
        const contents = yield Promise.all(promises);
        contents &&
            contents.forEach((c, i) => {
                pagesWithVariables.layout.layout[i].content = c;
            });
    }
    if (pagesWithVariables.variables) {
        pagesWithVariables.variables = pagesWithVariables.variables.map(v => {
            try {
                if (['array', 'object'].includes(v.type)) {
                    v.data = JSON.parse((0, string_1.replaceAll)(v.data, '\\', ''));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                }
            }
            return v;
        });
    }
    if (Array.isArray(page.history.layout.layout)) {
        const promises = page.history.layout.layout.reduce((acc, p) => {
            acc.push(p.content
                ? (0, content_1.insertDataToContent)(p.content, page.historyId, user.id)
                : null);
            return acc;
        }, []);
        const contents = yield Promise.all(promises);
        contents &&
            contents.forEach((c, i) => {
                page.history.layout.layout[i].content = c;
            });
    }
    if (page.script) {
        const tokens = (0, actionV2_1.parse)(page.script);
        const pageId = yield (0, actionV2_1.run)(tokens, null, user, page.historyId, new Map());
        if (pageId) {
            pagesWithVariables = yield (0, exports.getCurrentPageByHistoryId)(historyId, pageId, user);
        }
    }
    if (!!page.keypage) {
        const existedProgress = yield db_1.db.query.userHistoryProgreses.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.pageId, page.id), (0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.userId, user.id), (0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.historyId, page.historyId)),
        });
        if (!existedProgress) {
            let prevPageId = null;
            const prevPageByTime = yield db_1.db.query.userHistoryProgreses.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.userId, user.id), (0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.historyId, pagesWithVariables.historyId)),
                orderBy: (userHistoryProgreses, { desc }) => [
                    desc(userHistoryProgreses.id),
                ],
            });
            if (prevPageByTime) {
                prevPageId = prevPageByTime.pageId;
            }
            console.log(prevPageByTime);
            if (prevPageId != pagesWithVariables.id) {
                yield db_1.db.insert(page_1.userHistoryProgreses).values({
                    historyId: pagesWithVariables.historyId,
                    pageId: pagesWithVariables.id,
                    userId: user.id,
                    prevPageId: prevPageId,
                });
                if (prevPageByTime && !prevPageByTime.nextPageId) {
                    yield db_1.db
                        .update(page_1.userHistoryProgreses)
                        .set({
                        nextPageId: pagesWithVariables.id,
                    })
                        .where((0, drizzle_orm_1.eq)(page_1.userHistoryProgreses.id, prevPageByTime.id));
                }
            }
        }
    }
    return pagesWithVariables;
});
exports.getCurrentPageByHistoryId = getCurrentPageByHistoryId;
const runCode = (code, historyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = (0, actionV2_1.parse)(code);
    const user = yield db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_1.users.id, userId),
    });
    if (!user) {
        throw new error_1.ErrorBoundary('User not exist', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const pageId = yield (0, actionV2_1.run)(tokens, null, user, historyId, new Map());
    return pageId;
});
exports.runCode = runCode;
const deleteActionById = (actionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(page_1.pagePoints).where((0, drizzle_orm_1.eq)(page_1.pagePoints.id, actionId));
});
exports.deleteActionById = deleteActionById;
const updateAction = (actionId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const newAction = yield db_1.db
        .update(page_1.pagePoints)
        .set(data)
        .where((0, drizzle_orm_1.eq)(page_1.pagePoints.id, actionId))
        .returning();
    return newAction[0];
});
exports.updateAction = updateAction;
const executeActionPage = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const point = yield db_1.db.query.pagePoints.findFirst({
        where: (points, { eq }) => eq(points.id, id),
        with: {
            page: {
                with: {
                    history: true,
                },
            },
        },
    });
    if (!point) {
        throw new error_1.ErrorBoundary('Не найдено пункта по id - ' + id, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const tokens = (0, actionV2_1.parse)(point.action);
    const pageId = yield (0, actionV2_1.run)(tokens, null, user, 1, new Map());
    const page = yield (0, exports.getCurrentPageByHistoryId)(point.page.historyId, pageId == 0 ? id : pageId, user);
    return page;
});
exports.executeActionPage = executeActionPage;
const createPage = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existPageByName = yield db_1.db.query.pages.findFirst({
        where: (0, drizzle_orm_1.eq)(page_1.pages.name, data.name),
    });
    if (existPageByName) {
        throw new error_1.ErrorBoundary(`Страница с названием ${data.name} уже создана!`, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const value = {
        content: data.content,
        historyId: id,
        name: data.name,
        description: data.description ? data.description : undefined,
        image: data.image ? data.image : undefined,
        sound: data.sound ? data.sound : undefined,
    };
    const page = yield db_1.db.insert(page_1.pages).values(value).returning();
    return page[0];
});
exports.createPage = createPage;
const updatePage = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPage = yield db_1.db
        .update(page_1.pages)
        .set(data)
        .where((0, drizzle_orm_1.eq)(page_1.pages.id, id))
        .returning();
    return updatedPage[0];
});
exports.updatePage = updatePage;
const createPagePoint = (pageId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existPoint = yield db_1.db.query.pagePoints.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(page_1.pagePoints.pageId, pageId), (0, drizzle_orm_1.eq)(page_1.pagePoints.name, data.name)),
    });
    if (existPoint) {
        const updatedPoint = yield db_1.db
            .update(page_1.pagePoints)
            .set({
            action: data.action,
            name: data.name,
            pageId: pageId,
        })
            .where((0, drizzle_orm_1.eq)(page_1.pagePoints.pageId, pageId))
            .returning();
        return updatedPoint[0];
    }
    else {
        const createdPoint = yield db_1.db
            .insert(page_1.pagePoints)
            .values({
            action: data.action,
            name: data.name,
            pageId: pageId,
        })
            .returning();
        return createdPoint;
    }
});
exports.createPagePoint = createPagePoint;
const getPageList = (historyId) => __awaiter(void 0, void 0, void 0, function* () {
    const findedPages = yield db_1.db.query.pages.findMany({
        where: historyId ? (0, drizzle_orm_1.eq)(page_1.pages.historyId, historyId) : undefined,
        with: {
            history: true,
        },
    });
    return findedPages;
});
exports.getPageList = getPageList;
const getPage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield db_1.db.query.pages.findFirst({
        where: (0, drizzle_orm_1.eq)(page_1.pages.id, id),
        with: {
            points: true,
            history: {
                columns: {
                    sound: true,
                },
                with: {
                    layout: true,
                },
            },
            layout: true,
        },
    });
    if (!page) {
        throw Error(`Page not found by ${id}`);
    }
    return page;
});
exports.getPage = getPage;
const getPages = (params) => __awaiter(void 0, void 0, void 0, function* () {
    function buildWhereClause(filters, table) {
        const buildFilter = (filter) => {
            const parts = [];
            if (filter.field && filter.value && filter.operator) {
                const field = filter.field;
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
    try {
        let pagesFiltered = yield db_1.db.query.pages.findMany({
            with: {
                history: true,
            },
            limit: params.limit,
            offset: params.offset,
            orderBy: pages => orderBuilder(pages),
            where: pages => whereBuilder(pages),
        });
        return pagesFiltered;
    }
    catch (error) {
        throw new error_1.ErrorBoundary('Error has been get pages', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
});
exports.getPages = getPages;
const updateLayoutPage = (userId, pageId, layoutId, layoutData) => __awaiter(void 0, void 0, void 0, function* () {
    const existLayout = yield db_1.db.query.layouts.findFirst({
        where: (0, drizzle_orm_1.eq)(page_1.layouts.id, layoutId),
    });
    if (!existLayout) {
        throw new error_1.ErrorBoundary(`Layout by id ${layoutId} not exist`, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const page = yield db_1.db.query.pages.findFirst({
        where: (0, drizzle_orm_1.eq)(page_1.pages.id, pageId),
        with: {
            history: true,
        },
    });
    if (!page) {
        throw Error('Page of layout not found');
    }
    if (!page.layoutId || page.history.layoutId == page.layoutId) {
        let newDataLayout = Object.assign(existLayout, layoutData);
        newDataLayout.id = null;
        const createdLayout = yield db_1.db
            .insert(page_1.layouts)
            .values(newDataLayout)
            .returning();
        yield db_1.db
            .update(page_1.pages)
            .set({
            layoutId: createdLayout[0].id,
        })
            .where((0, drizzle_orm_1.eq)(page_1.pages.id, page.id));
        return createdLayout[0];
    }
    const updatedLayout = yield db_1.db
        .update(page_1.layouts)
        .set(layoutData)
        .where((0, drizzle_orm_1.eq)(page_1.layouts.id, layoutId))
        .returning();
    return updatedLayout[0];
});
exports.updateLayoutPage = updateLayoutPage;
//# sourceMappingURL=page.service.js.map