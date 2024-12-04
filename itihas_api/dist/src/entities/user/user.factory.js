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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsers = exports.generateCharactersToUsers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const faker_1 = require("@faker-js/faker");
const user_1 = require("./model/user");
const history_1 = require("../history/model/history");
const num_1 = require("../../lib/num");
const default_1 = require("../../lib/default");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(6);
    const hashedPassword = yield bcrypt_1.default.hash('itihas123', salt);
    let name = faker_1.faker.person.fullName() + (0, num_1.randomRangeInt)(0, 10000);
    let exist = yield db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_1.users.name, name),
    });
    if (exist) {
        name += faker_1.faker.person.fullName() + (0, num_1.randomRangeInt)(0, 10000);
    }
    const user = (yield db_1.db
        .insert(user_1.users)
        .values({
        name: faker_1.faker.person.fullName() + (0, num_1.randomRangeInt)(0, 10000),
        email: faker_1.faker.lorem.word() + '@media.com',
        password: hashedPassword,
    })
        .returning())[0];
    yield (0, default_1.createDefaulBookmarks)(user.id);
    return user.id;
});
const generateCharactersToUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const table = history_1.charactersToUsers;
    const name = 'персонажей к пользователям';
    yield db_1.db.delete(table);
    const createRandom = () => {
        return {
            characterId: (0, num_1.randomRangeInt)(1, 10),
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
exports.generateCharactersToUsers = generateCharactersToUsers;
const generateUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    // await db.delete(users);
    try {
        const idx = [];
        for (let i = 0; i < 10; i++) {
            const id = yield createUser();
            idx.push(id);
        }
        return {
            factory: 'Создание пользователей',
            status: true,
            message: 'Все пользователи успешно созданы',
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
exports.generateUsers = generateUsers;
