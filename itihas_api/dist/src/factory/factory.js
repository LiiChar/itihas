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
try {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Начало создания`);
        console.log(1);
        yield (0, page_factory_1.generateLayout)();
        console.log(2);
        yield (0, user_factory_1.generateUsers)();
        console.log(3);
        yield (0, history_factory_1.generateHistory)();
        console.log(5);
        yield (0, page_factory_1.generateBookmarks)();
        console.log(10);
        yield (0, history_factory_1.generateBookmarkToHistory)();
        console.log(11);
        yield (0, history_factory_1.generateCharacters)();
        console.log(12);
        yield (0, user_factory_1.generateCharactersToUsers)();
        console.log(13);
        yield (0, history_factory_1.generateGenre)();
        console.log(14);
        yield (0, page_factory_1.generatePage)(page_1.pagesContent);
        console.log(15);
        yield (0, page_factory_1.generatePagePoint)(page_1.pointsPageContent);
        console.log(16);
        yield (0, page_factory_1.generateVariable)();
        console.log(17);
        yield (0, history_factory_1.generateComments)();
        console.log(18);
        yield (0, page_factory_1.generateLikePages)();
        console.log(19);
        yield (0, history_factory_1.generateReplyComment)();
        console.log(20);
        yield (0, history_factory_1.generateSimilar)();
        console.log(21);
    }))();
}
catch (error) {
    if (error instanceof Error)
        console.log('Произовашла ошибка по причине: ', error.message);
}
