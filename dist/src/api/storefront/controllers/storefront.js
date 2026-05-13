"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("../../razorpay/services/razorpay"));
exports.default = {
    async products(ctx) {
        var _a;
        const tenant = ctx.query.tenant || ((_a = ctx.request.body) === null || _a === void 0 ? void 0 : _a.tenant) || null;
        const filters = { isActive: true };
        if (tenant)
            filters.tenant = tenant;
        const products = await strapi.entityService.findMany('api::product.product', {
            filters,
            populate: ['images', 'category'],
        });
        ctx.body = products;
    },
    async createOrder(ctx) {
        try {
            const { items, subtotal, tax = 0, total, tenant } = ctx.request.body;
            if (!items || !subtotal || !total)
                return ctx.badRequest('Missing order data');
            // Create razorpay order from total
            const razor = await razorpay_1.default.createOrder(Number(total), 'INR');
            const created = await strapi.entityService.create('api::order.order', {
                data: {
                    items,
                    subtotal,
                    tax,
                    total,
                    amount: Math.round(Number(total) * 100),
                    currency: 'INR',
                    status: 'pending',
                    razorpay_order_id: razor.id,
                    tenant: tenant || null,
                },
            });
            ctx.body = { success: true, order_id: created.id, razorpay_order_id: razor.id };
        }
        catch (e) {
            strapi.log.error('storefront.createOrder error', e);
            ctx.throw(500, 'Failed to create order');
        }
    },
    async verifyOrder(ctx) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = ctx.request.body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
                return ctx.badRequest('Missing fields');
            const ok = razorpay_1.default.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            const orders = await strapi.entityService.findMany('api::order.order', { filters: { razorpay_order_id } });
            if (!ok) {
                if (orders.length > 0) {
                    await strapi.entityService.update('api::order.order', orders[0].id, { data: { status: 'failed' } });
                }
                return ctx.badRequest('Invalid signature');
            }
            if (orders.length > 0) {
                const o = orders[0];
                await strapi.entityService.update('api::order.order', o.id, {
                    data: {
                        razorpay_payment_id,
                        razorpay_signature,
                        status: 'paid',
                    },
                });
                // generate invoice
                try {
                    await strapi.service('api::invoice.invoice').generate({ orderId: o.id });
                }
                catch (e) {
                    strapi.log.error('invoice generate failed', e);
                }
            }
            ctx.body = { success: true };
        }
        catch (e) {
            strapi.log.error('verifyOrder error', e);
            ctx.throw(500, 'Verification failed');
        }
    },
    async getOrder(ctx) {
        const id = ctx.params.id;
        if (!id)
            return ctx.badRequest('Missing id');
        const order = await strapi.entityService.findOne('api::order.order', id, { populate: ['customer', 'tenant'] });
        ctx.body = order;
    },
};
