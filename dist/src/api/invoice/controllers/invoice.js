"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::invoice.invoice', ({ strapi }) => ({
    async generate(ctx) {
        // Public endpoint for now: generate invoice from posted data
        const body = ctx.request.body;
        try {
            const { buffer, invoice } = await strapi.service('api::invoice.invoice').generatePDF(body);
            ctx.set('Content-Type', 'application/pdf');
            ctx.set('Content-Disposition', `attachment; filename="${invoice.invoice_number}.pdf"`);
            ctx.status = 200;
            ctx.body = buffer;
        }
        catch (err) {
            // Log full error for debugging
            strapi.log.error('Invoice generate error', err);
            ctx.status = 500;
            ctx.body = { error: 'Failed to generate invoice', message: err === null || err === void 0 ? void 0 : err.message, stack: err === null || err === void 0 ? void 0 : err.stack };
        }
    },
    async download(ctx) {
        const { id } = ctx.params;
        try {
            const record = await strapi.entityService.findOne('api::invoice.invoice', id, {});
            if (!record)
                return ctx.notFound('Invoice not found');
            // Re-generate PDF from stored invoice data
            const { buffer } = await strapi.service('api::invoice.invoice').generatePDF(record);
            ctx.set('Content-Type', 'application/pdf');
            ctx.set('Content-Disposition', `attachment; filename="${record.invoice_number}.pdf"`);
            ctx.status = 200;
            ctx.body = buffer;
        }
        catch (err) {
            strapi.log.error('Invoice download error', err);
            ctx.status = 500;
            ctx.body = { error: 'Failed to download invoice', message: err === null || err === void 0 ? void 0 : err.message, stack: err === null || err === void 0 ? void 0 : err.stack };
        }
    }
}));
