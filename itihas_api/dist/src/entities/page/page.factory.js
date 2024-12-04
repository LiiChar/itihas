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
exports.generateLikePages = exports.generateBookmarks = exports.generateLayout = exports.generatePagePoint = exports.generateVariable = exports.generatePage = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const faker_1 = require("@faker-js/faker");
const page_1 = require("./model/page");
const num_1 = require("../../lib/num");
const default_1 = require("../../lib/default");
const bookmark_1 = require("../bookmark/model/bookmark");
const generatePage = (pagesDefault) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(page_1.pages);
    const createRandomPage = () => {
        return {
            name: faker_1.faker.person.firstName(),
            image: faker_1.faker.image.url(),
            historyId: (0, num_1.randomRangeInt)(1, 100),
            content: 'Ваше имя {=name} и сейчас начинается ваше приключение',
        };
    };
    const pageArray = [
        ...(pagesDefault !== null && pagesDefault !== void 0 ? pagesDefault : []),
        ...faker_1.faker.helpers.multiple(createRandomPage, {
            count: 10,
        }),
    ];
    pageArray[2] = Object.assign(Object.assign({}, pageArray[2]), { sound: '/uploads/sound/default/Shoot-sound.mp3' });
    try {
        const idx = [];
        pageArray.forEach((page) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(page_1.pages).values(page).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание страницы историй',
            status: true,
            message: 'Все истории успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание страниц историй',
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание страниц историй',
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generatePage = generatePage;
const generateVariable = (varibableContent) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(page_1.variables);
    const createRandomVariable = () => {
        return {
            historyId: 1,
            variable: 'name',
            type: 'string',
            data: 'Владимир',
            userId: 1,
        };
    };
    const variableArray = [
        ...faker_1.faker.helpers.multiple(createRandomVariable, {
            count: 10,
        }),
        ...(varibableContent !== null && varibableContent !== void 0 ? varibableContent : []),
    ];
    variableArray.push({
        data: '100',
        type: 'number',
        historyId: 1,
        userId: 1,
        variable: 'hp',
    });
    try {
        const idx = [];
        variableArray.forEach((variable) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(page_1.variables).values(variable).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание данных историй',
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных историй',
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных историй',
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateVariable = generateVariable;
const generatePagePoint = (pagePointDefault) => __awaiter(void 0, void 0, void 0, function* () {
    const table = page_1.pagePoints;
    const name = 'поитов страницы';
    yield db_1.db.delete(table);
    let id = 20;
    const createRandom = () => {
        return {
            id,
            name: `Перейти на глвау ${id + 1}`,
            pageId: 1,
            action: `set(name,${faker_1.faker.person.firstName()});move(${++id});`,
        };
    };
    const array = pagePointDefault ||
        faker_1.faker.helpers.multiple(createRandom, {
            count: 50,
        });
    try {
        const idx = [];
        array.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(table).values(data).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание данных ' + name,
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generatePagePoint = generatePagePoint;
const generateLayout = (layoutsContent) => __awaiter(void 0, void 0, void 0, function* () {
    const table = page_1.layouts;
    const name = 'оформления';
    yield db_1.db.delete(table);
    const defaultLayout = [
        {
            type: 'image',
            align: ['top'],
            style: '',
        },
        {
            type: 'content',
            align: ['center'],
            style: '',
        },
        {
            type: 'points',
            align: ['bottom'],
            style: '',
        },
    ];
    const createRandom = () => {
        return {
            name: faker_1.faker.lorem.sentence({ min: 1, max: 2 }),
            layout: defaultLayout,
        };
    };
    const array = [
        ...faker_1.faker.helpers.multiple(createRandom, {
            count: 1,
        }),
        ...(layoutsContent !== null && layoutsContent !== void 0 ? layoutsContent : []),
    ];
    try {
        const idx = [];
        array.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(table).values(data).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание данных ' + name,
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateLayout = generateLayout;
const generateBookmarks = () => __awaiter(void 0, void 0, void 0, function* () {
    const table = bookmark_1.bookmarks;
    const name = 'закладки';
    yield db_1.db.delete(table);
    try {
        const idx = yield (0, default_1.createDefaulBookmarks)(1);
        return {
            factory: 'Создание данных ' + name,
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateBookmarks = generateBookmarks;
const generateLikePages = () => __awaiter(void 0, void 0, void 0, function* () {
    const table = page_1.likePages;
    const name = 'нравиться';
    yield db_1.db.delete(table);
    const createRandom = () => {
        return {
            pageId: (0, num_1.randomRangeInt)(1, 10),
            userId: (0, num_1.randomRangeInt)(1, 10),
        };
    };
    const array = faker_1.faker.helpers.multiple(createRandom, {
        count: 40,
    });
    try {
        const idx = [];
        array.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(table).values(data).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание данных ' + name,
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных ' + name,
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateLikePages = generateLikePages;
