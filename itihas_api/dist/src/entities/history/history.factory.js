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
exports.generateSimilar = exports.generateComments = exports.generateGenre = exports.generateHistory = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const faker_1 = require("@faker-js/faker");
const history_1 = require("./model/history");
const num_1 = require("../../lib/num");
const crypto_1 = require("crypto");
const generateHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(history_1.histories);
    const createRandomHistory = () => {
        return {
            name: faker_1.faker.person.firstName(),
            image: faker_1.faker.image.url(),
            description: faker_1.faker.lorem.text(),
            sound: '/uploads/sound/default/Apocryphos-Simulacrum-of-Stone.mp3',
            rate: (0, crypto_1.randomInt)(0, 5),
            authorId: 1,
        };
    };
    const historyArray = faker_1.faker.helpers.multiple(createRandomHistory, {
        count: 100,
    });
    try {
        const idx = [];
        historyArray.forEach((history) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(history_1.histories).values(history).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание истории',
            status: true,
            message: 'Все истории успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание пользователей',
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание пользователей',
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateHistory = generateHistory;
const generateGenre = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(history_1.genres);
    const createRandomGenre = () => {
        return {
            name: faker_1.faker.word.words(1),
        };
    };
    const genreArray = faker_1.faker.helpers.multiple(createRandomGenre, {
        count: 10,
    });
    try {
        const idx = [];
        genreArray.forEach((genre) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(history_1.genres).values(genre).returning())[0];
            idx.push(id);
        }));
        for (let i = 1; i <= 100; i++) {
            yield db_1.db.insert(history_1.genresToHistories).values({
                genreId: (0, num_1.randomRangeInt)(1, 10),
                historyId: i,
            });
        }
        return {
            factory: 'Создание жарнов',
            status: true,
            message: 'Все жанры успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание жарнов',
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание жанров',
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateGenre = generateGenre;
const generateComments = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(history_1.comments);
    const createRandom = () => {
        return {
            historyId: 1,
            userId: 1,
            content: faker_1.faker.lorem.paragraphs(4),
        };
    };
    const array = faker_1.faker.helpers.multiple(createRandom, {
        count: 10,
    });
    try {
        const idx = [];
        array.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(history_1.comments).values(data).returning())[0];
            idx.push(id);
        }));
        return {
            factory: 'Создание данных комментарии',
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных комментарии',
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных комментарии',
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateComments = generateComments;
const generateSimilar = () => __awaiter(void 0, void 0, void 0, function* () {
    const table = history_1.similarHistories;
    yield db_1.db.delete(table);
    const createRandom = () => {
        return {
            historyId: 1,
            similarHistoryId: (0, num_1.randomRangeInt)(1, 10),
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
            factory: 'Создание данных похожие',
            status: true,
            message: 'Все данные успешно созданы',
            idx: idx,
        };
    }
    catch (error) {
        if (error instanceof drizzle_orm_1.DrizzleError) {
            return {
                factory: 'Создание данных похожие',
                status: false,
                message: error.message,
            };
        }
        else {
            return {
                factory: 'Создание данных похожие',
                status: false,
                message: 'Произошла непредвиденная ошибка',
            };
        }
    }
});
exports.generateSimilar = generateSimilar;
