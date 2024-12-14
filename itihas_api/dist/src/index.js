"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = require("./entities/route");
const path_1 = __importDefault(require("path"));
const errorBoundaryMiddleware_1 = require("./middleware/errorBoundaryMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const websocket_1 = require("./websocket/websocket");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
exports.server = (0, http_1.createServer)(app);
exports.socket = (0, websocket_1.runWebsocket)();
app.get('/', (req, res) => {
    res.json('Server has been started');
});
app.use('/api', express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use((0, cors_1.default)({
// origin: '*',
// methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// preflightContinue: false,
// optionsSuccessStatus: 204,
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use('/api', route_1.route);
app.use(errorBoundaryMiddleware_1.errorBoundaryMiddleware);
exports.server.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`));
