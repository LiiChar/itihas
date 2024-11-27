"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRouter = void 0;
const express_1 = require("express");
const search_controller_1 = require("./search/search.controller");
const moduleRouter = (0, express_1.Router)();
exports.moduleRouter = moduleRouter;
moduleRouter.use('/', search_controller_1.searchRouter);
