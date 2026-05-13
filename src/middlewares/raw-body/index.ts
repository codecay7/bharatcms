import { IncomingMessage } from 'http';

/**
 * Middleware to capture raw request body for routes that need it (svix signature verification).
 * Only runs for POST /api/clerk-webhook/user-created to minimize overhead.
 */
export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: any) => {
    try {
      const method = (ctx.request.method || '').toUpperCase();
      const path = ctx.request.path || ctx.request.url || '';

      if (method === 'POST' && path === '/api/clerk-webhook/user-created') {
        // If rawBody already present, skip
        if (!ctx.state.rawBody) {
          // Read raw stream from the node IncomingMessage
          const req: IncomingMessage = ctx.req as IncomingMessage;
          const chunks: Buffer[] = [];
          await new Promise<void>((resolve, reject) => {
            req.on('data', (chunk: Buffer) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
            req.on('end', () => {
              try {
                const buf = Buffer.concat(chunks);
                ctx.state.rawBody = buf.toString('utf8');

                // Replay the consumed buffer by replacing ctx.req with a fresh Readable
                // so downstream body parsers (strapi's body) can still read it.
                try {
                  // Import at runtime to avoid ESM/CJS issues during build
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  const { Readable } = require('stream');
                  const newReq: any = new Readable();
                  newReq.push(buf);
                  newReq.push(null);
                  // copy minimal properties expected by parsers
                  newReq.headers = (req as any).headers;
                  newReq.method = (req as any).method;
                  newReq.url = (req as any).url;
                  if ((req as any).rawHeaders)
                    newReq.rawHeaders = (req as any).rawHeaders;
                  // swap the request object on the context
                  ctx.req = newReq;
                } catch (e) {
                  // If replay fails, leave rawBody set and continue; verification will handle it
                }
              } catch (e) {
                ctx.state.rawBody = '';
              }
              resolve();
            });
            req.on('error', (err) => reject(err));
          });
        }
      }
    } catch (e) {
      // swallow errors and continue — verification will handle invalid payloads
    }

    await next();
  };
};

// Ensure CommonJS consumers (Strapi's loader) get the middleware factory as module.exports
// This assignment will compile to `module.exports = exports.default` in dist.
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
(module as any).exports = (exports as any).default ?? (module as any).exports;
