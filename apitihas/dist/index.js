"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    server: function() {
        return server;
    },
    socket: function() {
        return socket;
    }
});
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _bodyparser = /*#__PURE__*/ _interop_require_default(require("body-parser"));
const _route = require("./entities/route");
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _errorBoundaryMiddleware = require("./middleware/errorBoundaryMiddleware");
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _http = require("http");
const _websocket = require("./websocket/websocket");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_dotenv.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, _express.default)();
const server = (0, _http.createServer)(app);
const socket = (0, _websocket.runWebsocket)();
app.get('/', (req, res)=>{
    res.json('Server has been started');
});
app.use('/api', _express.default.static(_path.default.join(__dirname, '..', 'public')));
app.use((0, _cors.default)({}));
app.use((0, _cookieparser.default)());
app.use(_bodyparser.default.json());
app.use('/api', _route.route);
app.use(_errorBoundaryMiddleware.errorBoundaryMiddleware);
server.listen(PORT, ()=>console.log(`Server has been started on http://localhost:${PORT}`));
const _default = app;

