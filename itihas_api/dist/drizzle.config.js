"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    dbCredentials: {
        url: './database.sqlite',
    },
    dialect: 'sqlite',
    schema: './src/database/scheme.ts',
    out: './drizzle',
});
