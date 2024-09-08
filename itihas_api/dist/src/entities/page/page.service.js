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
exports.createPagePoint = exports.createPage = exports.executeActionPage = exports.getCurrentPageByHistoryId = void 0;
const db_1 = require("../../database/db");
const content_1 = require("./lib/content");
const page_1 = require("./model/page");
const action_1 = require("./lib/action");
const getCurrentPageByHistoryId = (id, currentPage, user) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield db_1.db.query.pages.findFirst({
        where: (pages, { eq, and, or }) => {
            const ex = currentPage == 0
                ? or(eq(pages.type, 'start'), eq(pages.id, 1))
                : eq(pages.id, currentPage);
            return and(ex, eq(pages.historyId, id));
        },
        with: {
            points: true,
            history: {
                columns: {
                    sound: true,
                },
                with: {
                    wallpaper: true,
                    layout: true,
                },
            },
            layout: true,
            wallpaper: true,
        },
    });
    if (!page) {
        throw Error(`Не найдено главы по id ${currentPage}`);
    }
    const variables = yield db_1.db.query.variables.findMany({
        where: (variables, { eq, and }) => and(eq(variables.historyId, id), eq(variables.userId, user.id)),
    });
    const pagesWithVariables = Object.assign(page, { variables });
    pagesWithVariables['content'] = yield (0, content_1.insertDataToContent)(page.content, id, user.id);
    if (page.layout) {
        const promises = page.layout.layout.reduce((acc, p) => {
            acc.push(p.content
                ? (0, content_1.insertDataToContent)(p.content, page.historyId, user.id)
                : null);
            return acc;
        }, []);
        const contents = yield Promise.all(promises);
        contents.forEach((c, i) => {
            page.layout.layout[i].content = c;
        });
    }
    const promises = page.history.layout.layout.reduce((acc, p) => {
        acc.push(p.content
            ? (0, content_1.insertDataToContent)(p.content, page.historyId, user.id)
            : null);
        return acc;
    }, []);
    const contents = yield Promise.all(promises);
    contents.forEach((c, i) => {
        page.history.layout.layout[i].content = c;
    });
    return pagesWithVariables;
});
exports.getCurrentPageByHistoryId = getCurrentPageByHistoryId;
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
        throw Error('Не найдено пункта по id - ' + id);
    }
    const pageId = yield (0, action_1.executeAction)(point.page.historyId, user, point.action);
    const page = yield (0, exports.getCurrentPageByHistoryId)(point.page.historyId, pageId == 0 ? id : pageId, user);
    return page;
});
exports.executeActionPage = executeActionPage;
const createPage = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const value = {
        content: data.content,
        historyId: id,
        name: data.name,
        description: data.description ? data.description : undefined,
        image: data.image ? data.image : undefined,
        sound: data.sound ? data.sound : undefined,
    };
    yield db_1.db.insert(page_1.pages).values(value);
});
exports.createPage = createPage;
const createPagePoint = (pageId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.insert(page_1.pagePoints).values({
        action: data.action,
        name: data.name,
        pageId: pageId,
    });
});
exports.createPagePoint = createPagePoint;
