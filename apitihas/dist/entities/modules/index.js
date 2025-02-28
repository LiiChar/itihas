"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRouter = void 0;
const express_1 = require("express");
const search_controller_1 = require("./search/search.controller");
const gigaChat_controller_1 = require("./gigiChat/gigaChat.controller");
const variable_controller_1 = require("./variable/variable.controller");
const progress_controller_1 = require("./progress/progress.controller");
const moduleRouter = (0, express_1.Router)();
exports.moduleRouter = moduleRouter;
moduleRouter.use('/', search_controller_1.searchRouter);
moduleRouter.use('/chat', gigaChat_controller_1.gigaChatRouter);
moduleRouter.use('/progress', progress_controller_1.progressRouter);
moduleRouter.use('/variable', variable_controller_1.variableRouter);
//# sourceMappingURL=index.js.map