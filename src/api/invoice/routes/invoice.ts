export default {
  routes: [
    {
      method: 'POST',
      path: '/invoices/generate',
      handler: 'invoice.generate',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/invoices/:id/download',
      handler: 'invoice.download',
      config: {
        auth: false
      }
    }
  ]
};
