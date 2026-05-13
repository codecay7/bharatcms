"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svix_1 = require("svix");
const clerk_sdk_node_1 = __importDefault(require("@clerk/clerk-sdk-node"));
exports.default = {
    async handle(ctx) {
        const secret = process.env.CLERK_WEBHOOK_SECRET || '';
        if (secret && secret.length > 0) {
            const svixId = ctx.request.header['svix-id'];
            const svixTs = ctx.request.header['svix-timestamp'];
            const svixSig = ctx.request.header['svix-signature'];
            if (!svixId || !svixTs || !svixSig) {
                ctx.status = 401;
                ctx.body = { error: 'missing svix headers' };
                return;
            }
            try {
                const wh = new svix_1.Webhook(secret);
                // use raw body captured by middleware if available
                const raw = ctx.state && ctx.state.rawBody ? ctx.state.rawBody : JSON.stringify(ctx.request.body);
                wh.verify(raw, {
                    'svix-id': svixId,
                    'svix-timestamp': svixTs,
                    'svix-signature': svixSig,
                });
            }
            catch (err) {
                ctx.status = 401;
                ctx.body = { error: 'invalid signature' };
                return;
            }
        }
        const { type, data } = ctx.request.body || {};
        if (type === 'user.created') {
            const clerkId = data.id;
            const firstName = data.first_name || '';
            const lastName = data.last_name || '';
            const name = `${firstName} ${lastName}`.trim() || clerkId;
            const existing = await strapi.entityService.findMany('api::tenant.tenant', {
                filters: { owner_clerk_id: clerkId },
            });
            let saved = null;
            if (existing && existing.length > 0) {
                saved = existing[0];
            }
            else {
                saved = await strapi.entityService.create('api::tenant.tenant', {
                    data: {
                        name,
                        owner_clerk_id: clerkId,
                        plan: 'hobby',
                        status: 'active',
                        slug: clerkId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    },
                });
            }
            try {
                if (process.env.CLERK_API_KEY) {
                    await clerk_sdk_node_1.default.users.updateUserMetadata(clerkId, {
                        unsafeMetadata: { tenantId: saved.id, plan: 'hobby' },
                    });
                }
            }
            catch (e) {
                // ignore
            }
            ctx.body = { received: true, tenantId: saved.id };
            return;
        }
        ctx.body = { received: true };
    },
};
