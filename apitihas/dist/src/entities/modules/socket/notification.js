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
exports.notificationHandlers = exports.notificationEvent = exports.addNotificationEvent = exports.notificationFacade = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../database/db");
const notification_1 = require("../../notification/model/notification");
const error_1 = require("../../../lib/error");
const http_status_codes_1 = require("http-status-codes");
const __1 = require("../../..");
const history_1 = require("../../history/model/history");
const page_1 = require("../../page/model/page");
const notificationFacade = () => {
    (0, exports.addNotificationEvent)('user:add', 'Ваш профиль был создан');
    (0, exports.addNotificationEvent)('user:update', 'Ваш профиль был обновлён');
    (0, exports.addNotificationEvent)('user:remove', 'Пользователь был удалена');
    (0, exports.addNotificationEvent)('user:reply', 'Пользователь была переслан');
    (0, exports.addNotificationEvent)('history:add', 'История была добавлена');
    (0, exports.addNotificationEvent)('history:update', 'История была обновлена');
    (0, exports.addNotificationEvent)('history:remove', 'История была удалена');
    (0, exports.addNotificationEvent)('history:reply', 'История была переслана');
    (0, exports.addNotificationEvent)('page:add', 'Страница была добавлена');
    (0, exports.addNotificationEvent)('page:update', 'Страница была обновлена');
    (0, exports.addNotificationEvent)('page:remove', 'Страница была удалена');
    (0, exports.addNotificationEvent)('page:reply', 'Страница была переслана');
    (0, exports.addNotificationEvent)('comment:add', 'Комментарий была добавлена');
    (0, exports.addNotificationEvent)('comment:update', 'Комментарий была обновлена');
    (0, exports.addNotificationEvent)('comment:remove', 'Комментарий была удалена');
    (0, exports.addNotificationEvent)('comment:reply', 'Комментарий была переслана');
};
exports.notificationFacade = notificationFacade;
const addNotificationEvent = (event, message, description) => __awaiter(void 0, void 0, void 0, function* () {
    const existNotification = yield db_1.db.query.notificationEvents.findFirst({
        where: (0, drizzle_orm_1.eq)(notification_1.notificationEvents.event, event),
    });
    if (existNotification) {
        return;
    }
    const [target, type] = event.split(':');
    yield db_1.db.insert(notification_1.notificationEvents).values({
        event,
        message,
        description,
    });
});
exports.addNotificationEvent = addNotificationEvent;
const notificationEvent = (event_1, data_1, ...args_1) => __awaiter(void 0, [event_1, data_1, ...args_1], void 0, function* (event, data, userIdx = []) {
    const notificationEvent = yield db_1.db.query.notificationEvents.findFirst({
        where: (0, drizzle_orm_1.eq)(notification_1.notificationEvents.event, event),
    });
    if (!notificationEvent) {
        throw new error_1.ErrorBoundary('Notification not exist', http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    }
    const notificationPromises = [];
    const idx = new Set([
        ...userIdx,
        ...(yield exports.notificationHandlers[event](data)),
    ]);
    idx &&
        idx.forEach(userId => {
            const nPromise = db_1.db
                .insert(notification_1.notificationEventsToUsers)
                .values({
                notificationId: notificationEvent.id,
                userId: userId,
                data: data,
            })
                .returning();
            notificationPromises.push(nPromise);
        });
    let resultNotification = yield Promise.all(notificationPromises).then(data => data[0]);
    const response = Object.assign(notificationEvent, {
        event,
        notificationData: data,
    });
    resultNotification &&
        resultNotification.forEach(n => {
            __1.socket.to(`notification:${n.userId}`).emit('event', response);
        });
});
exports.notificationEvent = notificationEvent;
exports.notificationHandlers = {
    'user:update': (data) => __awaiter(void 0, void 0, void 0, function* () {
        return [+data.userId];
    }),
    'user:add': (data) => __awaiter(void 0, void 0, void 0, function* () {
        return [+data.userId];
    }),
    'user:remove': (data) => __awaiter(void 0, void 0, void 0, function* () {
        return [+data.userId];
    }),
    'user:reply': (data) => __awaiter(void 0, void 0, void 0, function* () {
        return [+data.userId];
    }),
    'history:update': (data) => __awaiter(void 0, void 0, void 0, function* () {
        const usersIdx = (yield db_1.db.query.bookmarksToHistories.findMany({
            where: (0, drizzle_orm_1.eq)(history_1.bookmarksToHistories.historyId, data.id),
            with: {
                bookmark: {
                    with: {
                        user: {
                            columns: {
                                id: true,
                            },
                        },
                    },
                },
            },
        })).map(b => b.bookmark.user.id);
        return usersIdx;
    }),
    'history:add': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'history:remove': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'history:reply': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'comment:update': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'comment:add': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'comment:remove': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'comment:reply': (data) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Function not implemented.');
    }),
    'page:update': (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdx = yield db_1.db.query.pages.findFirst({
            where: (0, drizzle_orm_1.eq)(page_1.pages.id, data.id),
            with: {
                history: {
                    with: {
                        bookmarks: {
                            with: {
                                bookmark: {
                                    with: {
                                        user: {
                                            columns: {
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!userIdx) {
            return [];
        }
        return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
    }),
    'page:add': (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdx = yield db_1.db.query.pages.findFirst({
            where: (0, drizzle_orm_1.eq)(page_1.pages.id, data.id),
            with: {
                history: {
                    with: {
                        bookmarks: {
                            with: {
                                bookmark: {
                                    with: {
                                        user: {
                                            columns: {
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!userIdx) {
            return [];
        }
        return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
    }),
    'page:remove': (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdx = yield db_1.db.query.pages.findFirst({
            where: (0, drizzle_orm_1.eq)(page_1.pages.id, data.id),
            with: {
                history: {
                    with: {
                        bookmarks: {
                            with: {
                                bookmark: {
                                    with: {
                                        user: {
                                            columns: {
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!userIdx) {
            return [];
        }
        return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
    }),
    'page:reply': (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdx = yield db_1.db.query.pages.findFirst({
            where: (0, drizzle_orm_1.eq)(page_1.pages.id, data.id),
            with: {
                history: {
                    with: {
                        bookmarks: {
                            with: {
                                bookmark: {
                                    with: {
                                        user: {
                                            columns: {
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!userIdx) {
            return [];
        }
        return userIdx.history.bookmarks.map(b => b.bookmark.user.id);
    }),
};
