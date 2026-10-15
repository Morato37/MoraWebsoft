import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Invoice, InvoiceItem } from './types';

const BRAND = {
  cyan:  [0, 188, 212]    as [number, number, number],
  text:  [40, 40, 60]     as [number, number, number],
  muted: [120, 120, 150]  as [number, number, number],
  light: [220, 220, 230]  as [number, number, number],
  white: [255, 255, 255]  as [number, number, number],
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-CH', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

function formatCHF(value: number): string {
  return `CHF ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
}

async function generateQR(text: string, width = 160): Promise<string | null> {
  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
  } catch {
    return null;
  }
}

async function loadPublicImage(path: string): Promise<string | null> {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function buildSwissQrPayload(invoice: Invoice): string {
  const customer = invoice.admin_customers;
  return [
    'SPC',
    '0200',
    '1',
    'CH1300253253103333M1H',
    'S',
    'Matteo Mora',
    'Alt Ferrachstrasse',
    '37',
    '8630',
    'Rüti',
    'CH',
    '', '', '', '', '', '', '',
    Number(invoice.total).toFixed(2),
    'CHF',
    'K',
    customer?.name ?? '',
    customer?.address ?? '',
    '',
    'CH',
    'NON',
    `Rechnung ${invoice.invoice_number}`,
    'EPD',
  ].join('\n');
}

export async function openInvoicePdf(invoice: Invoice, items: InvoiceItem[]): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;

  const ETH_ADDR = '0x444920D5A72F2CA91E876781e3302549eF8926cB';
  const SOL_ADDR = 'DGR7BisMWvG3aXshFRLVq2H8mjSCDrfJCGxnu1PdgK2F';

  const [ethQr, solQr, swissQr] = await Promise.all([
    loadPublicImage('/eth-qr.png'),
    loadPublicImage('/sol-qr.png'),
    generateQR(buildSwissQrPayload(invoice), 520),
  ]) as [string | null, string | null, string | null];

  // ── HEADER ──────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.cyan);
  doc.text('MoraWebsoft', margin, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...BRAND.cyan);
  doc.text(invoice.invoice_number, W - margin, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text(`Ausgestellt: ${formatDate(invoice.issue_date)}`, W - margin, 27, { align: 'right' });
  doc.text(`Fällig: ${formatDate(invoice.due_date)}`, W - margin, 33, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...BRAND.text);
  doc.text('RECHNUNG', margin, 38);

  // ── DIVIDER ─────────────────────────────────────────────────────────────
  const divY = 50;
  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(margin, divY, W - margin, divY);

  // ── FROM / TO ────────────────────────────────────────────────────────────
  const toX = W / 2;
  let y = divY + 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.muted);
  doc.text('VON', margin, y);
  doc.text('AN', toX, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.cyan);
  doc.text('Matteo Mora', margin, y);
  doc.setTextColor(...BRAND.text);
  doc.text(invoice.admin_customers?.name ?? '—', toX, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.text);
  ['MoraWebsoft', '8630 Rüti ZH', 'matteo@morawebsoft.com'].forEach(line => { doc.text(line, margin, y); y += 5; });

  const customerLines: string[] = [];
  if (invoice.admin_customers?.company) customerLines.push(invoice.admin_customers.company);
  if (invoice.admin_customers?.address) customerLines.push(invoice.admin_customers.address);
  if (invoice.admin_customers?.email) customerLines.push(invoice.admin_customers.email);
  const customerStartY = divY + 25;
  customerLines.forEach((line, i) => doc.text(line, toX, customerStartY + i * 5));

  // ── ITEMS TABLE ──────────────────────────────────────────────────────────
  const tableY = Math.max(y, customerStartY + customerLines.length * 5) + 8;

  doc.setFillColor(245, 247, 250);
  doc.rect(margin, tableY, contentW, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.muted);
  const cols = { num: margin + 3, desc: margin + 12, qty: W - margin - 80, price: W - margin - 45, total: W - margin - 5 };
  doc.text('#', cols.num, tableY + 5);
  doc.text('BESCHREIBUNG', cols.desc, tableY + 5);
  doc.text('MENGE', cols.qty, tableY + 5, { align: 'right' });
  doc.text('EINZELPREIS', cols.price, tableY + 5, { align: 'right' });
  doc.text('TOTAL', cols.total, tableY + 5, { align: 'right' });

  let rowY = tableY + 8;
  items.forEach((item, i) => {
    const bg: [number, number, number] = i % 2 === 0 ? [255, 255, 255] : [248, 249, 252];
    doc.setFillColor(...bg);
    doc.rect(margin, rowY, contentW, 8, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.text);
    doc.text(String(i + 1), cols.num, rowY + 5.5);
    doc.text(item.description, cols.desc, rowY + 5.5);
    doc.text(String(item.quantity), cols.qty, rowY + 5.5, { align: 'right' });
    doc.text(`CHF ${Number(item.unit_price).toFixed(2)}`, cols.price, rowY + 5.5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.cyan);
    doc.text(`CHF ${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}`, cols.total, rowY + 5.5, { align: 'right' });
    rowY += 8;
  });

  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(margin, rowY, W - margin, rowY);

  // ── TOTALS ───────────────────────────────────────────────────────────────
  rowY += 8;
  const totalsX = W - margin - 75;

  const addRow = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 10 : 9);
    doc.setTextColor(...BRAND.muted);
    doc.text(label, totalsX, rowY);
    doc.setTextColor(bold ? BRAND.cyan[0] : BRAND.text[0], bold ? BRAND.cyan[1] : BRAND.text[1], bold ? BRAND.cyan[2] : BRAND.text[2]);
    doc.text(value, W - margin, rowY, { align: 'right' });
    rowY += bold ? 8 : 6;
  };

  addRow('Zwischensumme', `CHF ${Number(invoice.subtotal).toFixed(2)}`);
  addRow(`MwSt. ${invoice.tax_rate}%`, `CHF ${Number(invoice.tax_amount).toFixed(2)}`);
  doc.setDrawColor(...BRAND.light);
  doc.line(totalsX, rowY - 2, W - margin, rowY - 2);
  rowY += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.text);
  doc.text('Gesamtbetrag', totalsX, rowY);
  doc.setTextColor(...BRAND.cyan);
  doc.text(`CHF ${Number(invoice.total).toFixed(2)}`, W - margin, rowY, { align: 'right' });
  rowY += 12;

  // ── NOTES ────────────────────────────────────────────────────────────────
  if (invoice.notes) {
    doc.setDrawColor(...BRAND.light);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, rowY, contentW, 14, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...BRAND.muted);
    doc.text('NOTIZEN', margin + 4, rowY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.text);
    doc.text(invoice.notes, margin + 4, rowY + 11);
    rowY += 20;
  }

  // ── PAYMENT INFO ─────────────────────────────────────────────────────────
  rowY += 6;
  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(margin, rowY, W - margin, rowY);
  rowY += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.text);
  doc.text('Zahlungsinformationen', margin, rowY);
  rowY += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.muted);
  doc.text('Zahlungskonditionen:', margin, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.text);
  doc.text('30 Tage', margin + 40, rowY);
  rowY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.muted);
  doc.text('Zahlbar an (IBAN):', margin, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.text);
  doc.text('CH13 0025 3253 1033 33M1 H', margin + 40, rowY);
  rowY += 10;

  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...BRAND.text);
  doc.text('ZAHLUNGSINFORMATIONEN', margin, 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text(`Rechnung ${invoice.invoice_number}`, margin, 29);

  doc.setDrawColor(...BRAND.cyan);
  doc.setLineWidth(0.6);
  doc.line(margin, 36, W - margin, 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.text);
  doc.text('Empfangsschein', margin, 50);
  doc.text('Zahlteil', 94, 50);
  doc.setDrawColor(...BRAND.light);
  doc.line(86, 44, 86, 125);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('Zahlungsempfänger', margin, 59);
  doc.setTextColor(...BRAND.text);
  doc.text('Matteo Mora', margin, 66);
  doc.text('Alt Ferrachstrasse 37', margin, 72);
  doc.text('8630 Rüti, Schweiz', margin, 78);
  doc.setTextColor(...BRAND.muted);
  doc.text('Betrag', margin, 84);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.text);
  doc.text(formatCHF(invoice.total), margin, 91);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.muted);
  doc.text('Mitteilung', margin, 109);
  doc.setTextColor(...BRAND.text);
  doc.text(`Rechnung ${invoice.invoice_number}`, margin, 116);

  if (swissQr) {
    doc.addImage(swissQr, 'PNG', 145, 64, 46, 46);
    doc.setFillColor(255, 255, 255);
    doc.rect(163, 82, 10, 10, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.8);
    doc.line(165, 87, 171, 87);
    doc.line(168, 84, 168, 90);
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('Scannen Sie den QR-Code mit Ihrer Banking-App.', 94, 59);
  doc.setTextColor(...BRAND.text);
  doc.text('Matteo Mora', 94, 68);
  doc.text('Alt Ferrachstrasse 37', 94, 74);
  doc.text('8630 Rüti, Schweiz', 94, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCHF(invoice.total), 94, 106);

  doc.setDrawColor(...BRAND.light);
  doc.line(margin, 122, W - margin, 122);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.text);
  doc.text('Crypto-Zahlungen', margin, 136);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('Alternativ können Sie den Rechnungsbetrag an eine der folgenden Adressen senden.', margin, 143);

  const qrSize = 34;
  const cryptoY = 153;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.text);
  doc.text('ETH', margin, cryptoY);
  doc.text('SOL', margin + 70, cryptoY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...BRAND.muted);
  doc.text(ETH_ADDR, margin, cryptoY + 5);
  doc.text(SOL_ADDR, margin + 70, cryptoY + 5);
  if (ethQr) doc.addImage(ethQr, 'PNG', margin, cryptoY + 10, qrSize, qrSize);
  if (solQr) doc.addImage(solQr, 'PNG', margin + 70, cryptoY + 10, qrSize, qrSize);

  // ── FOOTER ───────────────────────────────────────────────────────────────
  const footerY = 287;
  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, W - margin, footerY - 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('MoraWebsoft · matteo@morawebsoft.com · 8630 Rüti ZH', W / 2, footerY, { align: 'center' });

  doc.save(`${invoice.invoice_number}.pdf`);
}
