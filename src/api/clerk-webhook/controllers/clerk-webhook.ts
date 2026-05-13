import { Webhook } from 'svix';
import clerkClient from '@clerk/clerk-sdk-node';

export default {
  async handle(ctx: any) {
    // Verify svix signature (Clerk uses svix signing)
    const signature = ctx.request.header['svix-signature'] || ctx.request.header['svix_signature'] || '';
    const secret = process.env.CLERK_WEBHOOK_SECRET || '';

    try {
      if (secret && secret.length > 0) {
        const wh = new Webhook(secret);
        // stringify the parsed body to approximate the raw payload
        wh.verify(JSON.stringify(ctx.request.body), signature);
      }
    } catch (err) {
      // invalid signature
      ctx.status = 401;
      ctx.body = { error: 'invalid signature' };
      return;
    }

    const { type, data } = ctx.request.body || {};

    if (type === 'user.created') {
      const clerkId = data.id;
      const firstName = data.first_name || '';
      const lastName = data.last_name || '';
      const name = `${firstName} ${lastName}`.trim() || clerkId;

      // check for existing tenant for this clerk user
      const existing = await strapi.entityService.findMany('api::tenant.tenant', {
        filters: { owner_clerk_id: clerkId },
      });

      let saved: any = null;
      if (existing && existing.length > 0) {
        saved = existing[0];
      } else {
        // create tenant record with default hobby plan
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

      // Attempt to update Clerk unsafeMetadata with tenantId and plan
      try {
        if (process.env.CLERK_API_KEY) {
          await clerkClient.users.updateUserMetadata(clerkId, {
            unsafeMetadata: { tenantId: saved.id, plan: 'hobby' },
          });
        }
      } catch (e) {
        // ignore Clerk update failures in webhook to avoid blocking the flow
      }

      ctx.body = { received: true, tenantId: saved.id };
      return;
    }

    ctx.body = { received: true };
  },
};
