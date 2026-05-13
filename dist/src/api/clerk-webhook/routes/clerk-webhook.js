"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/clerk-webhook',
            handler: 'clerk-webhook.handle',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
