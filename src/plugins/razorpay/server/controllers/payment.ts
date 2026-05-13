import paymentService from '../services/payment';

const VALID_PLANS = ['starter', 'pro', 'business', 'lifetime'];

export default {

  // POST /api/razorpay/create-order
  async createOrder(ctx) {
    try {
      const { amount, currency = 'INR', plan } = ctx.request.body;

      // ✅ Validate amount
      if (!amount || typeof amount !== 'number' || amount < 1) {
        return ctx.badRequest('Amount is required and must be >= 1');
      }

      // ✅ Validate plan
      if (!plan || !VALID_PLANS.includes(plan)) {
        return ctx.badRequest(`Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}`);
      }

      // Create Razorpay order
      const order = await paymentService.createOrder(amount, currency);

      // ✅ Save to DB — status: created
      await strapi.entityService.create('api::order.order', {
        data: {
          razorpay_order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: 'created',
          plan,
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

  // POST /api/razorpay/verify-payment
  async verifyPayment(ctx) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        customer_email,
        customer_name,
        customer_phone,
      } = ctx.request.body;

      // ✅ Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return ctx.badRequest('Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature');
      }

      // ✅ Verify signature
      const isValid = paymentService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      // Find the order in DB
      const existingOrders = await strapi.entityService.findMany('api::order.order', {
        filters: { razorpay_order_id },
      });

      if (!isValid) {
        // ❌ Mark as failed
        if (existingOrders.length > 0) {
          await strapi.entityService.update('api::order.order', existingOrders[0].id, {
            data: { status: 'failed' },
          });
        }
        return ctx.badRequest('Invalid payment signature');
      }

      // ✅ Mark as paid + save customer info
      if (existingOrders.length > 0) {
        await strapi.entityService.update('api::order.order', existingOrders[0].id, {
          data: {
            razorpay_payment_id,
            razorpay_signature,
            status: 'paid',
            customer_email: customer_email || null,
            customer_name: customer_name || null,
            customer_phone: customer_phone || null,
          },
        });
      }

      strapi.log.info(`✅ Payment verified: ${razorpay_payment_id} | Order: ${razorpay_order_id}`);

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

};
