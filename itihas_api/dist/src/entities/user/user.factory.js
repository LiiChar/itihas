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
exports.generateUsers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../database/db");
const faker_1 = require("@faker-js/faker");
const user_1 = require("./user");
const generateUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(user_1.users);
    const createRandomUser = () => {
        return {
            name: faker_1.faker.person.firstName(),
            password: '$2b$06$j8YfOMk8muT4UCZhYRM32.ymitBl.DnR7id/9ujI70H2.tJwySgj.',
        };
    };
    const userArray = faker_1.faker.helpers.multiple(createRandomUser, {
        count: 10,
    });
    try {
        const idx = [];
        userArray.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = (yield db_1.db.insert(user_1.users).values(user).returning())[0];
            idx.push(id);
        }));
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
