import { factories } from '@strapi/strapi';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

type InvoiceItem = {
  description: string;
  hsn_code?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number; // percent, e.g., 18
};

function formatINR(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

function formatDate(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

async function generateInvoiceNumber(strapiInstance: any) {
  const count = await strapiInstance.entityService.count('api::invoice.invoice', {});
  const next = count + 1;
  return `BCMS-2026-${String(next).padStart(4, '0')}`;
}

export default factories.createCoreService('api::invoice.invoice', ({ strapi }) => ({
  async generatePDF(data: any) {
    const items: InvoiceItem[] = data.items || [];

    const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);

    const sellerState = 'Maharashtra';
    const buyerState = data.buyer_state || sellerState;
    const taxRate = items.length ? items[0].tax_rate : 18;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (sellerState === buyerState) {
      cgst = +(subtotal * (taxRate / 100) / 2).toFixed(2);
      sgst = +(subtotal * (taxRate / 100) / 2).toFixed(2);
    } else {
      igst = +((subtotal * (taxRate / 100))).toFixed(2);
    }

    const total = +(subtotal + cgst + sgst + igst).toFixed(2);

    const invoice_number = data.invoice_number || await generateInvoiceNumber(strapi);

    const pdfDoc = await PDFDocument.create();
    // register fontkit so pdf-lib can embed TTF/OTF font files
    try {
      pdfDoc.registerFontkit(fontkit as any);
    } catch (e) {
      // ignore if registration fails; embedding will fall back
    }
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    // Prefer DejaVu Sans (system) for rupee glyph; fall back to Helvetica.
    let embeddedFont: any = null;
    let fallbackToWinAnsi = false;
    try {
      const dejavu = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
      if (fs.existsSync(dejavu)) {
        const fontBytes = fs.readFileSync(dejavu);
        embeddedFont = await pdfDoc.embedFont(fontBytes);
      }

      if (!embeddedFont) {
        embeddedFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        fallbackToWinAnsi = true;
      }
    } catch (e) {
      // fallback to standard font
      embeddedFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      fallbackToWinAnsi = true;
    }

    // production: do not emit debug logs

    const margin = 40;
    let y = height - margin;

    const sellerName = data.seller_name || 'BharatCMS';
    const sellerGST = data.seller_gstin || 'GS29AABCU9603R1ZX';

    // If we're using a WinAnsi font, replace the rupee symbol with 'Rs.' to avoid encoding errors.
    const safeText = (text: string) => {
      if (!text) return '';
      let t = String(text);
      if (fallbackToWinAnsi) {
        t = t.replace(/₹/g, 'Rs.');
        // strip non-ascii to be extra safe
        t = t.replace(/[^\u0000-\u007f]/g, '');
      }
      return t;
    };

    const draw = (txt: string, opts: any) => {
      try {
        page.drawText(safeText(txt), { font: embeddedFont, ...opts });
      } catch (e) {
        // ignore single draw failures to be robust
      }
    };

    draw(sellerName, { x: margin, y: y - 10, size: 18, color: rgb(0, 0.83, 1) });
    y -= 30;
    draw(`Invoice: ${invoice_number}`, { x: margin, y: y - 6, size: 12 });
    draw(`Date: ${formatDate(new Date())}`, { x: width - 180, y: y - 6, size: 12 });
    y -= 20;

    draw(`Seller GSTIN: ${sellerGST}`, { x: margin, y: y - 6, size: 10 });
    y -= 20;

    draw(`Bill To: ${data.buyer_name || ''}`, { x: margin, y: y - 6, size: 12 });
    y -= 16;
    draw(`Email: ${data.buyer_email || ''}`, { x: margin, y: y - 6, size: 10 });
    y -= 12;
    if (data.buyer_gstin) {
      draw(`Buyer GSTIN: ${data.buyer_gstin}`, { x: margin, y: y - 6, size: 10 });
      y -= 12;
    }

    draw(`Address: ${data.buyer_address || ''}`, { x: margin, y: y - 6, size: 10, maxWidth: width - margin * 2 });
    y -= 30;

    // Table header
    draw('Description', { x: margin, y: y - 6, size: 10 });
    draw('HSN', { x: margin + 260, y: y - 6, size: 10 });
    draw('Qty', { x: margin + 310, y: y - 6, size: 10 });
    draw('Rate', { x: margin + 350, y: y - 6, size: 10 });
    draw('Amount', { x: margin + 430, y: y - 6, size: 10 });
    y -= 16;

    items.forEach((it) => {
      const amount = +(it.quantity * it.unit_price).toFixed(2);
      draw(it.description || '', { x: margin, y: y - 6, size: 10 });
      draw(it.hsn_code || '-', { x: margin + 260, y: y - 6, size: 10 });
      draw(String(it.quantity), { x: margin + 310, y: y - 6, size: 10 });
      draw(formatINR(it.unit_price), { x: margin + 350, y: y - 6, size: 10 });
      draw(formatINR(amount), { x: margin + 430, y: y - 6, size: 10 });
      y -= 14;
    });

    y -= 6;
    draw(`Subtotal: ${formatINR(subtotal)}`, { x: margin + 350, y: y - 6, size: 11 });
    y -= 14;
    if (cgst) draw(`CGST: ${formatINR(cgst)}`, { x: margin + 350, y: y - 6, size: 11 });
    y -= 14;
    if (sgst) draw(`SGST: ${formatINR(sgst)}`, { x: margin + 350, y: y - 6, size: 11 });
    y -= 14;
    if (igst) draw(`IGST: ${formatINR(igst)}`, { x: margin + 350, y: y - 6, size: 11 });
    y -= 18;
    draw(`Total: ${formatINR(total)}`, { x: margin + 350, y: y - 6, size: 12 });

    draw('Thank you for your purchase.', { x: margin, y: 40, size: 10 });

    // production: do not append debug invoice JSON to the PDF

    const pdfBytes = await pdfDoc.save();

    // Save invoice entity in Strapi
    let tenantToSave = null;
    if (data.tenant) {
      try {
        const t = await strapi.entityService.findOne('api::tenant.tenant', data.tenant, {});
        if (t) tenantToSave = data.tenant;
      } catch (e) {
        tenantToSave = null;
      }
    }

    const saved = await strapi.entityService.create('api::invoice.invoice', {
      data: {
        invoice_number,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email,
        buyer_gstin: data.buyer_gstin,
        buyer_address: data.buyer_address,
        seller_gstin: sellerGST,
        items,
        subtotal,
        cgst,
        sgst,
        igst,
        total,
        payment_id: data.payment_id,
        tenant: tenantToSave,
        status: data.status || 'paid'
      }
    });

    return {
      buffer: Buffer.from(pdfBytes),
      invoice: saved
    };
  }
}));
