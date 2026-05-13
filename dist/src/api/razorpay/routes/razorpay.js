"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/razorpay/create-order',
            handler: 'razorpay.createOrder',
            config: { auth: false },
        },
        {
            method: 'POST',
            path: '/razorpay/verify-payment',
            handler: 'razorpay.verifyPayment',
            config: { auth: false },
        },
        {
            method: 'GET',
            path: '/razorpay/lifetime-status',
            handler: 'razorpay.lifetimeStatus',
            config: { auth: false },
        },
    ],
};
