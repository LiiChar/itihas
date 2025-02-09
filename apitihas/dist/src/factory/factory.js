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
const genres_1 = require("./content/genres");
const history_1 = require("./content/history");
const layout_1 = require("./content/layout");
const page_1 = require("./content/page");
const variable_1 = require("./content/variable");
try {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Начало создания`);
        console.log(1, ' Генерация пользователей');
        yield (0, user_factory_1.generateUsers)();
        console.log(2, ' Генерация расположений контента');
        yield (0, page_factory_1.generateLayout)(layout_1.LayoutContent);
        console.log(3, ' Генерация история');
        yield (0, history_factory_1.generateHistory)(history_1.historyContent);
        console.log(4, ' Генерация закладок');
        yield (0, page_factory_1.generateBookmarks)();
        console.log(5, ' Генерация закладок к историям');
        yield (0, history_factory_1.generateBookmarkToHistory)();
        console.log(6, ' Генерация персонажей');
        yield (0, history_factory_1.generateCharacters)();
        console.log(7, ' Генерация персонажей к историям');
        yield (0, user_factory_1.generateCharactersToUsers)();
        console.log(8, ' Генерация жанров');
        yield (0, history_factory_1.generateGenre)(genres_1.genresContent);
        console.log(9, ' Генерация страниц');
        yield (0, page_factory_1.generatePage)(page_1.pagesContent);
        console.log(10, ' Генерация пунктов выбора историй');
        yield (0, page_factory_1.generatePagePoint)(page_1.pointsPageContent);
        console.log(11, ' Генерация параметров');
        yield (0, page_factory_1.generateVariable)(variable_1.VariableContent);
        console.log(12, ' Генерация комментариев');
        yield (0, history_factory_1.generateComments)();
        console.log(13, ' Генерация лайков к страницам');
        yield (0, page_factory_1.generateLikePages)();
        console.log(14, ' Генерация комментариев');
        yield (0, history_factory_1.generateReplyComment)();
        console.log(15, ' Генерация похожих историй');
        yield (0, history_factory_1.generateSimilar)();
    }))();
}
catch (error) {
    if (error instanceof Error)
        console.log('Произовашла ошибка по причине: ', error.message);
}
