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
exports.progressRouter = void 0;
const express_1 = require("express");
const progress_service_1 = require("./progress.service");
const progressRouter = (0, express_1.Router)();
exports.progressRouter = progressRouter;
progressRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.user_id ? +req.query.user_id : undefined;
    const historyId = req.query.history_id ? +req.query.history_id : undefined;
    const pageId = req.query.page_id ? +req.query.page_id : undefined;
    const progress = yield (0, progress_service_1.getProgress)({ historyId, pageId, userId });
    return res.json(progress);
}));
//# sourceMappingURL=progress.controller.js.map