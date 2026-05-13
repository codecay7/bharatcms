import { Strapi } from '@strapi/strapi';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;     // 10 requests per IP per minute

export default (config: any, { strapi }: { strapi: Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {

    // Only protect Razorpay routes
    if (!ctx.path.startsWith('/api/razorpay')) {
      return next();
    }

    const ip = ctx.request.ip || ctx.ip || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }

    if (record.count >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      ctx.status = 429;
      ctx.body = {
        error: 'Too many requests',
        message: `Max ${MAX_REQUESTS} requests/minute. Try again in ${retryAfter}s.`,
        retryAfter,
      };
      return;
    }

    record.count += 1;
    return next();
  };
};
