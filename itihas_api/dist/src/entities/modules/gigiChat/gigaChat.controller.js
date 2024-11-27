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
exports.gigaChatRouter = void 0;
const express_1 = require("express");
const gigachat_node_1 = require("gigachat-node");
const http_status_codes_1 = require("http-status-codes");
const gigaChatRouter = (0, express_1.Router)();
exports.gigaChatRouter = gigaChatRouter;
let token = '';
gigaChatRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const question = req.body.question;
    if (!question || question == '') {
        return res.json('Question not request').status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const client = new gigachat_node_1.GigaChat('MDlkNmVlMWEtNDJiZC00ZjFjLWEwZTMtMGViNjFjNWNmMGJmOmM4OTg1YThiLTUxODQtNDI1YS1iMzMwLTZhODY3OWI5OTUwOQ==', true, true, true);
    yield client.createToken();
    const responce = yield client.completion({
        model: 'GigaChat:latest',
        messages: [
            {
                role: 'user',
                content: question,
            },
        ],
    });
    return res.json(responce);
}));
