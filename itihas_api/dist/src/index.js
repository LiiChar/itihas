"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = require("./entities/route");
const path_1 = __importDefault(require("path"));
const cookieMiddleware_1 = require("./middleware/cookieMiddleware");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use('/api', express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use(cookieMiddleware_1.cookiesMiddleware);
app.use(body_parser_1.default.json());
app.use('/api', route_1.route);
app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`));
