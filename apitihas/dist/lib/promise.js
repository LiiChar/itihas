"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seqRunner = void 0;
const seqRunner = function (deeds) {
    return deeds.reduce(function (p, deed) {
        return p.then(function () {
            // Выполняем следующую функцию только после того, как отработала
            // предыдущая.
            return deed();
        });
    }, Promise.resolve()); // Инициализируем очередь выполнения.
};
exports.seqRunner = seqRunner;
//# sourceMappingURL=promise.js.map