export default {
  routes: [
    {
      method: 'POST',
      path: '/clerk-webhook/user-created',
      handler: 'clerk-webhook.handle',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
