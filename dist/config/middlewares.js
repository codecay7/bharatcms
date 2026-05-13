"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::logger',
    // capture raw body for specific webhooks before Strapi's body parser
    {
        resolve: `${__dirname}/../src/middlewares/raw-body/index.js`,
        config: {},
    },
    'strapi::body',
    'strapi::query',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
    'strapi::errors',
    'strapi::security',
    'strapi::compression',
    'global::rate-limit',
];
