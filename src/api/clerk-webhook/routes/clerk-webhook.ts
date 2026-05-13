export default {
  routes: [
    {
      method: 'POST',
      path: '/clerk-webhook',
      handler: 'clerk-webhook.handle',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
