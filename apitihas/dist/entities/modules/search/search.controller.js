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
exports.searchRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const search_service_1 = require("./search.service");
const searchRouter = (0, express_1.Router)();
exports.searchRouter = searchRouter;
searchRouter.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchParam = req.query.search;
    if (!searchParam) {
        return res.json().status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const searchedValues = yield (0, search_service_1.search)(searchParam);
    return res.json(searchedValues).status(http_status_codes_1.StatusCodes.OK);
}));
//# sourceMappingURL=search.controller.js.map