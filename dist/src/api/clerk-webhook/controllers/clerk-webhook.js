"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async handle(ctx) {
        const { type, data } = ctx.request.body;
        if (type === 'user.created') {
            const clerkId = data.id;
            const firstName = data.first_name || '';
            const lastName = data.last_name || '';
            const name = `${firstName} ${lastName}`.trim() || clerkId;
            await strapi.entityService.create('api::tenant.tenant', {
                data: {
                    name,
                    owner_clerk_id: clerkId,
                    plan: 'hobby',
                    status: 'active',
                    slug: clerkId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                },
            });
            ctx.body = { received: true };
            return;
        }
        ctx.body = { received: true };
    },
};
