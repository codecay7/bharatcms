"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.default = {
    async createOrder(amount, currency = 'INR') {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: `rcpt_${Date.now()}`,
        });
        return order;
    },
    verifyPayment(orderId, paymentId, signature) {
        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');
        return expectedSignature === signature;
    },
    async fetchPayment(paymentId) {
        return await razorpay.payments.fetch(paymentId);
    },
};
