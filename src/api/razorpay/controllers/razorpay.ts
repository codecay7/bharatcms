import razorpayService from '../services/razorpay';

const VALID_PLANS = ['starter', 'pro', 'business', 'lifetime'];
const LIFETIME_CAP = 100;

export default {
  async createOrder(ctx) {
    try {
      const { amount, currency = 'INR', plan, tenantId } = ctx.request.body;

      if (!amount || typeof amount !== 'number' || amount < 1) {
        return ctx.badRequest('Amount is required and must be >= 1');
      }

      if (!plan || !VALID_PLANS.includes(plan)) {
        return ctx.badRequest(`Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}`);
      }

      // ✅ Lifetime cap check — count paid lifetime orders
      if (plan === 'lifetime') {
        const lifetimeCount = await strapi.entityService.count('api::order.order', {
          filters: { plan: 'lifetime', status: 'paid' },
        });
        if (lifetimeCount >= LIFETIME_CAP) {
          return ctx.badRequest(`Lifetime deal is sold out. Only ${LIFETIME_CAP} spots available.`);
        }
      }

      const order = await razorpayService.createOrder(amount, currency);

      await strapi.entityService.create('api::order.order', {
        data: {
          razorpay_order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: 'created' as any,
          plan: plan as any,
          tenant: tenantId || null,
        },
      });

      ctx.body = {
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      };

    } catch (err) {
      strapi.log.error('❌ createOrder error:', err);
      ctx.throw(500, 'Failed to create order');
    }
  },

  async verifyPayment(ctx) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        customer_email,
        customer_name,
        customer_phone,
        tenantId,
      } = ctx.request.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return ctx.badRequest('Missing required fields');
      }

      const isValid = razorpayService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      const existingOrders = await strapi.entityService.findMany('api::order.order', {
        filters: { razorpay_order_id },
      });

      if (!isValid) {
        if (existingOrders.length > 0) {
          await strapi.entityService.update('api::order.order', existingOrders[0].id, {
            data: { status: 'failed' as any },
          });
        }
        return ctx.badRequest('Invalid payment signature');
      }

      if (existingOrders.length > 0) {
        const order = existingOrders[0];

        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            razorpay_payment_id,
            razorpay_signature,
            status: 'paid' as any,
            customer_email: customer_email || null,
            customer_name: customer_name || null,
            customer_phone: customer_phone || null,
          },
        });

        if (tenantId) {
          await strapi.entityService.update('api::tenant.tenant', tenantId, {
            data: { plan: order.plan as any },
          });
          strapi.log.info(`🚀 Tenant ${tenantId} upgraded to ${order.plan}`);
        }

        // ✅ Log remaining lifetime spots after each sale
        if (order.plan === 'lifetime') {
          const soldCount = await strapi.entityService.count('api::order.order', {
            filters: { plan: 'lifetime', status: 'paid' },
          });
          strapi.log.info(`⚡ Lifetime deals sold: ${soldCount}/${LIFETIME_CAP}`);
        }
      }

      ctx.body = {
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
      };

    } catch (err) {
      strapi.log.error('❌ verifyPayment error:', err);
      ctx.throw(500, 'Payment verification failed');
    }
  },

  // ✅ New endpoint — billing page calls this to show sold count
  async lifetimeStatus(ctx) {
    try {
      const soldCount = await strapi.entityService.count('api::order.order', {
        filters: { plan: 'lifetime', status: 'paid' },
      });
      ctx.body = {
        sold: soldCount,
        cap: LIFETIME_CAP,
        remaining: LIFETIME_CAP - soldCount,
        soldOut: soldCount >= LIFETIME_CAP,
      };
    } catch (err) {
      ctx.throw(500, 'Failed to fetch lifetime status');
    }
  },
};
