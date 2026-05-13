export default {
  routes: [
    {
      method: 'POST',
      path: '/create-test-product',
      handler: 'dev.createTestProduct',
      config: { auth: false },
    },
  ],
};
