import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default {
  // Create a Razorpay order
  async createOrder(amount: number, currency = 'INR', receipt?: string) {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    return order;
  },

  // Verify payment signature
  verifyPayment(orderId: string, paymentId: string, signature: string) {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  },

  // Fetch payment details
  async fetchPayment(paymentId: string) {
    return await razorpay.payments.fetch(paymentId);
  },
};
