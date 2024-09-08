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
exports.generateLayout = exports.generateWallpaper = exports.generatePagePoint = exports.generateVariable = exports.generatePage = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const faker_1 = require("@faker-js/faker");
const page_1 = require("./model/page");
const num_1 = require("../../lib/num");
const generatePage = (pagesDefault) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(page_1.pages);
    const createRandomPage = () => {
        return {
            name: faker_1.faker.person.firstName(),
            image: faker_1.faker.image.url(),
            historyId: 1,
            content: 'Ваше имя {=name} и сейчас начинается ваше приключение',
        };
    };
    const pageArray = pagesDefault ||
        faker_1.faker.helpers.multiple(createRandomPage, {
            count: 10,
        });
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
const generateVariable = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const variableArray = faker_1.faker.helpers.multiple(createRandomVariable, {
        count: 10,
    });
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
const generateWallpaper = () => __awaiter(void 0, void 0, void 0, function* () {
    const table = page_1.wallpapers;
    const name = 'обоев';
    yield db_1.db.delete(table);
    const wallpapersArray = [
        'yoon-hye.jpg',
        'succulent.png',
        'stairs.jpg',
        'retro-pc.png',
        'prakasam-mathaiyan.jpg',
        'plant.png',
        'lonely_tree.jpg',
        'kien-do-uUVkzxDR1D0-unsplash.jpg',
        'fog_forest_alt_2.png',
        'fog_forest_2.png',
        'clay-banks-u27Rrbs9Dwc-unsplash.jpg',
    ];
    const createRandom = () => {
        return {
            name: faker_1.faker.lorem.sentence(),
            source: `/uploads/wallpaper/${wallpapersArray[(0, num_1.randomRangeInt)(0, 9)]}`,
        };
    };
    const array = faker_1.faker.helpers.multiple(createRandom, {
        count: 10,
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
exports.generateWallpaper = generateWallpaper;
const generateLayout = () => __awaiter(void 0, void 0, void 0, function* () {
    const table = page_1.layouts;
    const name = 'оформления';
    yield db_1.db.delete(table);
    const defaultLayout = [
        {
            type: 'image',
            align: 'center',
            style: '',
            content: null,
        },
        {
            type: 'content',
            align: 'center',
            style: '',
            content: null,
        },
        {
            type: 'points',
            align: 'center',
            style: '',
            content: null,
        },
    ];
    const createRandom = () => {
        return {
            name: faker_1.faker.lorem.sentence({ min: 1, max: 2 }),
            layout: defaultLayout,
        };
    };
    const array = faker_1.faker.helpers.multiple(createRandom, {
        count: 1,
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
exports.generateLayout = generateLayout;
