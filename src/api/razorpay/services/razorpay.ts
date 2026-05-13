import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default {
  async createOrder(amount: number, currency = 'INR') {
    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    });
    return order;
  },

  verifyPayment(orderId: string, paymentId: string, signature: string) {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  },

  async fetchPayment(paymentId: string) {
    return await razorpay.payments.fetch(paymentId);
  },
};
