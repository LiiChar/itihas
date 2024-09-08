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
const history_factory_1 = require("../entities/history/history.factory");
const page_factory_1 = require("../entities/page/page.factory");
const user_factory_1 = require("../entities/user/user.factory");
const page_1 = require("./content/page");
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Начало создания`);
    yield Promise.all([
        yield (0, page_factory_1.generateLayout)(),
        yield (0, user_factory_1.generateUsers)(),
        yield (0, page_factory_1.generateWallpaper)(),
        yield (0, history_factory_1.generateHistory)(),
        yield (0, history_factory_1.generateGenre)(),
        yield (0, page_factory_1.generatePage)(page_1.pagesContent),
        yield (0, page_factory_1.generatePagePoint)(page_1.pointsPageContent),
        yield (0, page_factory_1.generateVariable)(),
        yield (0, history_factory_1.generateComments)(),
        yield (0, history_factory_1.generateSimilar)(),
    ]).then(status => {
        console.log(status);
    });
}))();
