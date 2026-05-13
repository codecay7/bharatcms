"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async createTestProduct(ctx) {
        try {
            const product = await strapi.entityService.create('api::product.product', {
                data: {
                    name: 'Starter Plan',
                    slug: 'starter-plan',
                    description: 'BharatCMS Starter',
                    price: 499,
                    stock: 100,
                    isActive: true,
                },
            });
            ctx.body = { created: true, product };
        }
        catch (e) {
            strapi.log.error('createTestProduct error', e);
            ctx.throw(500, 'Failed to create test product');
        }
    },
};
