'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const method = (ctx.request.method || '').toUpperCase();
      const path = ctx.request.path || ctx.request.url || '';

      if (method === 'POST' && path === '/api/clerk-webhook/user-created') {
        if (!ctx.state.rawBody) {
          const req = ctx.req;
          const chunks = [];
          await new Promise((resolve, reject) => {
            req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
            req.on('end', () => {
              try {
                const buf = Buffer.concat(chunks);
                ctx.state.rawBody = buf.toString('utf8');

                // Replace the consumed request stream with a fresh Readable stream
                // so downstream body parsers can still read the request.
                try {
                  const { Readable } = require('stream');
                  const newReq = new Readable();
                  newReq.push(buf);
                  newReq.push(null);
                  // copy important properties
                  newReq.headers = req.headers;
                  newReq.method = req.method;
                  newReq.url = req.url;
                  // preserve rawHeaders if present
                  if (req.rawHeaders) newReq.rawHeaders = req.rawHeaders;
                  // swap the request object on the context
                  ctx.req = newReq;
                } catch (e) {
                  // if replay fails, continue — body parser may error but verification will handle it
                }
              } catch (err) {
                ctx.state.rawBody = '';
              }
              resolve();
            });
            req.on('error', reject);
          });
        }
      }
    } catch (e) {
      // swallow — let verification handle bad payloads
    }
    await next();
  };
};
