"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/create-test-product',
            handler: 'dev.createTestProduct',
            config: { auth: false },
        },
    ],
};
