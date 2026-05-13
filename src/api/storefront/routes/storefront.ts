export default {
  routes: [
    {
      method: 'GET',
      path: '/storefront/products',
      handler: 'storefront.products',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/storefront/orders/create',
      handler: 'storefront.createOrder',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/storefront/orders/verify',
      handler: 'storefront.verifyOrder',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/storefront/orders/:id',
      handler: 'storefront.getOrder',
      config: { auth: false },
    },
  ],
};
