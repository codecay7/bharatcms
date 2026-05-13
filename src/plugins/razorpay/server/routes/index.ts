export default {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'POST',
        path: '/create-order',
        handler: 'payment.createOrder',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/verify-payment',
        handler: 'payment.verifyPayment',
        config: {
          auth: false,
        },
      },
    ],
  },
};
