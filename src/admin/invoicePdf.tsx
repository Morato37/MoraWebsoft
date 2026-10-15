import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Invoice, InvoiceItem } from './types';
import { buildSwissQrPayload, formatQrAmount, CREDITOR } from './swissQr';

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

function drawSwissQr(doc: jsPDF, payload: string, x: number, y: number): void {
  const qr = QRCode.create(payload, { errorCorrectionLevel: 'M' });
  const moduleSize = 46 / qr.modules.size;
  doc.setFillColor(0, 0, 0);
  for (let row = 0; row < qr.modules.size; row += 1) {
    let start = -1;
    for (let col = 0; col <= qr.modules.size; col += 1) {
      const dark = col < qr.modules.size && qr.modules.get(row, col);
      if (dark && start < 0) start = col;
      if ((!dark || col === qr.modules.size) && start >= 0) {
        doc.rect(x + start * moduleSize, y + row * moduleSize, (col - start) * moduleSize, moduleSize, 'F');
        start = -1;
      }
    }
  }
  const center = 23;
  doc.setFillColor(255, 255, 255);
  doc.rect(x + center - 3.5, y + center - 3.5, 7, 7, 'F');
  doc.setFillColor(0, 0, 0);
  doc.rect(x + center - 3, y + center - 3, 6, 6, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + center - 1.95, y + center - 0.585, 3.9, 1.17, 'F');
  doc.rect(x + center - 0.585, y + center - 1.95, 1.17, 3.9, 'F');
}

export async function openInvoicePdf(invoice: Invoice, items: InvoiceItem[]): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;

  const ETH_ADDR = '0x444920D5A72F2CA91E876781e3302549eF8926cB';
  const SOL_ADDR = 'DGR7BisMWvG3aXshFRLVq2H8mjSCDrfJCGxnu1PdgK2F';

  const swissPayload = buildSwissQrPayload({
    invoiceNumber: invoice.invoice_number,
    total: Number(invoice.total),
    customer: invoice.admin_customers ? {
      name: invoice.admin_customers.name,
      company: invoice.admin_customers.company,
      street: invoice.admin_customers.street ?? '',
      house_number: invoice.admin_customers.house_number ?? '',
      postal_code: invoice.admin_customers.postal_code ?? '',
      town: invoice.admin_customers.town ?? '',
      country: invoice.admin_customers.country ?? 'CH',
    } : null,
  });
  console.info('[Swiss QR payload]\n' + swissPayload.split('\n').map((line, index) => `${index + 1}: ${line}`).join('\n'));
  const [ethQr, solQr] = await Promise.all([
    loadPublicImage('/eth-qr.png'),
    loadPublicImage('/sol-qr.png'),
  ]) as [string | null, string | null];

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
  doc.setTextColor(...BRAND.muted);
  doc.setFontSize(8.5);
  doc.text('Zahlbar an (IBAN):', margin, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.text);
  doc.text('CH13 0025 3253 1033 33M1 H', margin + 40, rowY);
  rowY += 10;

  doc.addPage();
  const qrLines = swissPayload.split('\n');
  const ibanPrinted = qrLines[3].replace(/(.{4})/g, '$1 ').trim();
  const referencePrinted = qrLines[28].replace(/(.{4})/g, '$1 ').trim();
  const customer = invoice.admin_customers;
  const customerName = customer?.company || customer?.name || '';
  const customerStreetLine = customer?.street
    ? `${customer.street}${customer.house_number ? ` ${customer.house_number}` : ''}`
    : (customer?.address || '');
  const customerTownLine = customer?.postal_code && customer?.town
    ? `${customer.postal_code} ${customer.town}`
    : (!customer?.street && customer?.address ? '' : '');

  const hasAnyCustomerInfo = Boolean(customerName || customerStreetLine || customerTownLine);
  const printedPayerLines = [customerName, customerStreetLine, customerTownLine].filter(Boolean);
  const paymentX = 67;
  const detailsX = 118;
  const detailsWidth = 87;
  const receiptX = 5;
  const receiptWidth = 52;
  const drawCornerField = (x: number, y: number, width: number, height: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.75);
    const corner = 3;
    doc.line(x, y, x + corner, y); doc.line(x, y, x, y + corner);
    doc.line(x + width, y, x + width - corner, y); doc.line(x + width, y, x + width, y + corner);
    doc.line(x, y + height, x + corner, y + height); doc.line(x, y + height, x, y + height - corner);
    doc.line(x + width, y + height, x + width - corner, y + height); doc.line(x + width, y + height, x + width, y + height - corner);
  };
  const textBlock = (label: string, lines: string[], x: number, y: number, width: number, valueSize: number) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0, 0, 0); doc.text(label, x, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(valueSize);
    doc.text(doc.splitTextToSize(lines.filter(Boolean).join('\n'), width), x, y + 4);
  };

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(0, 192, 210, 192);
  doc.line(62, 192, 62, 297);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Empfangsschein', receiptX, 197);
  doc.text('Zahlteil', paymentX, 197);

  textBlock('Konto / Zahlbar an', [ibanPrinted, CREDITOR.name, `${CREDITOR.street} ${CREDITOR.houseNumber}`, `${CREDITOR.postalCode} ${CREDITOR.town}`], receiptX, 204, receiptWidth, 8);
  textBlock('Referenz', [referencePrinted], receiptX, 229, receiptWidth, 8);
  if (hasAnyCustomerInfo) {
    textBlock('Zahlbar durch', printedPayerLines, receiptX, 242, receiptWidth, 8);
  } else {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.text('Zahlbar durch (Name/Adresse)', receiptX, 242);
    drawCornerField(receiptX, 246, receiptWidth, 20);
  }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.text('Währung', receiptX, 270); doc.text('Betrag', 17, 270);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text('CHF', receiptX, 275); doc.text(formatQrAmount(Number(invoice.total)), 17, 275);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.text('Annahmestelle', 57, 280, { align: 'right' });

  drawSwissQr(doc, swissPayload, paymentX, 209);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('Währung', paymentX, 260); doc.text('Betrag', 80, 260);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text('CHF', paymentX, 266); doc.text(formatQrAmount(Number(invoice.total)), 80, 266);
  textBlock('Konto / Zahlbar an', [ibanPrinted, CREDITOR.name, `${CREDITOR.street} ${CREDITOR.houseNumber}`, `${CREDITOR.postalCode} ${CREDITOR.town}`], detailsX, 199, detailsWidth, 10);
  textBlock('Referenz', [referencePrinted], detailsX, 224, detailsWidth, 10);
  textBlock('Zusätzliche Informationen', [`Rechnung ${invoice.invoice_number}`], detailsX, 237, detailsWidth, 10);
  if (hasAnyCustomerInfo) {
    textBlock('Zahlbar durch', printedPayerLines, detailsX, 250, detailsWidth, 10);
  } else {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('Zahlbar durch (Name/Adresse)', detailsX, 250);
    drawCornerField(detailsX, 254, 65, 25);
  }

  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(20, 115, 190, 115);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...BRAND.text);
  doc.text('Zahlungskonditionen:', 20, 122);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...BRAND.muted);
  doc.text('30 Tage', 60, 122);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...BRAND.text); doc.text('Krypto-Zahlungen', 20, 131);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...BRAND.muted);
  doc.text('Alternativ konnen Sie den Rechnungsbetrag an eine der folgenden Adressen senden.', 20, 138);
  const cryptoCards = [
    { label: 'Ethereum (ETH)', addr: ETH_ADDR, qr: ethQr, x: 20 },
    { label: 'Solana (SOL)', addr: SOL_ADDR, qr: solQr, x: 110 },
  ];
  cryptoCards.forEach(card => {
    doc.setDrawColor(...BRAND.light); doc.setLineWidth(0.3);
    doc.roundedRect(card.x, 144, 80, 44, 2, 2, 'S');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...BRAND.text);
    doc.text(card.label, card.x + 4, 151);
    if (card.qr) doc.addImage(card.qr, 'PNG', card.x + 4, 155, 22, 22);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(...BRAND.muted);
    const addrLines = doc.splitTextToSize(card.addr, 48);
    doc.text(addrLines, card.x + 30, 160);
  });

  doc.save(`${invoice.invoice_number}.pdf`);
}
