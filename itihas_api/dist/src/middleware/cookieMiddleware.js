"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookiesMiddleware = void 0;
const cookiesMiddleware = (req, res, next) => {
    const { headers: { cookie }, } = req;
    if (cookie) {
        const values = cookie.split(';').reduce((res, item) => {
            const data = item.trim().split('=');
            return Object.assign(Object.assign({}, res), { [data[0]]: data[1] });
        }, {});
        res.locals.cookie = values;
    }
    else
        res.locals.cookie = {};
    next();
};
exports.cookiesMiddleware = cookiesMiddleware;
