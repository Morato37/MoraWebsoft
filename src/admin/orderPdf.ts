import jsPDF from 'jspdf';
import type { Order } from './types';

const BRAND = {
  cyan: [0, 188, 212] as [number, number, number],
  text: [40, 40, 60] as [number, number, number],
  muted: [120, 120, 150] as [number, number, number],
  light: [220, 220, 230] as [number, number, number],
};

function formatCHF(value: number): string {
  return `CHF ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('de-CH');
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 4): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function downloadOrderPdf(order: Order): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const width = 210;
  const margin = 20;
  const contentWidth = width - margin * 2;
  const customer = order.admin_customers;
  const items = order.items ?? [];
  let y = 20;

  // ── HEADER ──────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND.cyan);
  doc.text('MoraWebsoft', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text(`Datum: ${formatDate(order.order_date)}`, width - margin, y, { align: 'right' });
  doc.text(`Status: ${order.status}`, width - margin, y + 5, { align: 'right' });

  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...BRAND.text);
  doc.text('AUFTRAG', margin, y);

  y += 12;
  doc.setDrawColor(...BRAND.cyan);
  doc.setLineWidth(0.7);
  doc.line(margin, y, width - margin, y);
  y += 12;

  // ── FROM / TO ────────────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.muted);
  doc.text('VON', margin, y);
  doc.text('AN', width / 2, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.text);
  doc.text('Matteo Mora', margin, y);
  doc.text(customer?.name ?? '—', width / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 5;
  doc.text('MoraWebsoft · 8630 Rüti ZH', margin, y);
  if (customer?.company) doc.text(customer.company, width / 2, y);
  y += 5;
  doc.text('matteo@morawebsoft.com', margin, y);
  if (customer?.email) doc.text(customer.email, width / 2, y);
  if (customer?.address) {
    y = addWrappedText(doc, customer.address, width / 2, y + 5, contentWidth / 2 - 4, 4);
  } else {
    y += 5;
  }

  // ── TITLE ────────────────────────────────────────────────────────────────
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.text);
  y = addWrappedText(doc, order.title, margin, y, contentWidth, 6) + 5;

  // ── ITEMS TABLE ──────────────────────────────────────────────────────────
  if (items.length > 0) {
    const drawTableHeader = () => {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...BRAND.muted);
      doc.text('#', margin + 3, y + 5);
      doc.text('LEISTUNG', margin + 12, y + 5);
      doc.text('MENGE', width - margin - 75, y + 5, { align: 'right' });
      doc.text('EINZELPREIS', width - margin - 42, y + 5, { align: 'right' });
      doc.text('TOTAL', width - margin - 3, y + 5, { align: 'right' });
      y += 8;
    };

    drawTableHeader();
    items.forEach((item, index) => {
      const descriptionLines = doc.splitTextToSize(item.description, 78) as string[];
      const noteLines = item.note ? doc.splitTextToSize(item.note, 78) as string[] : [];
      const rowHeight = Math.max(9, (descriptionLines.length + noteLines.length) * 4 + 4);
      if (y + rowHeight > 250) {
        doc.addPage();
        y = 20;
        drawTableHeader();
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...BRAND.text);
      doc.text(String(index + 1), margin + 3, y + 5);
      doc.text(descriptionLines, margin + 12, y + 5);
      if (noteLines.length > 0) {
        doc.setFontSize(7.5);
        doc.setTextColor(...BRAND.muted);
        doc.text(noteLines, margin + 12, y + 5 + descriptionLines.length * 4);
      }
      doc.setFontSize(9);
      doc.setTextColor(...BRAND.text);
      doc.text(String(item.quantity), width - margin - 75, y + 5, { align: 'right' });
      doc.text(formatCHF(Number(item.unit_price)), width - margin - 42, y + 5, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BRAND.cyan);
      doc.text(formatCHF(Number(item.quantity) * Number(item.unit_price)), width - margin - 3, y + 5, { align: 'right' });
      doc.setDrawColor(...BRAND.light);
      doc.line(margin, y + rowHeight, width - margin, y + rowHeight);
      y += rowHeight;
    });

    // ── TOTALS ───────────────────────────────────────────────────────────────
    y += 8;
    const totalsX = width - margin - 75;
    const addTotal = (label: string, value: string, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(bold ? 11 : 9);
      doc.setTextColor(...(bold ? BRAND.text : BRAND.muted));
      doc.text(label, totalsX, y);
      doc.setTextColor(...(bold ? BRAND.cyan : BRAND.text));
      doc.text(value, width - margin, y, { align: 'right' });
      y += bold ? 8 : 6;
    };
    addTotal('Zwischensumme', formatCHF(Number(order.subtotal)));
    if (Number(order.discount_amount) > 0) {
      addTotal('Rabatt', `- ${formatCHF(Number(order.discount_amount))}`);
    }
    addTotal(`MwSt. ${order.tax_rate}%`, formatCHF(Number(order.tax_amount)));
    doc.setDrawColor(...BRAND.light);
    doc.line(totalsX, y - 2, width - margin, y - 2);
    y += 3;
    addTotal('Gesamtbetrag', formatCHF(Number(order.total)), true);
  }

  // ── NOTES ────────────────────────────────────────────────────────────────
  if (order.notes) {
    y += 8;
    doc.setDrawColor(...BRAND.light);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...BRAND.muted);
    doc.text('BEMERKUNGEN', margin + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...BRAND.text);
    addWrappedText(doc, order.notes, margin + 4, y + 11, contentWidth - 8, 4);
  }

  // ── FOOTER ───────────────────────────────────────────────────────────────
  doc.setDrawColor(...BRAND.cyan);
  doc.line(margin, 282, width - margin, 282);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('MoraWebsoft · matteo@morawebsoft.com · 8630 Rüti ZH', width / 2, 288, { align: 'center' });
  doc.save(`${order.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'auftrag'}.pdf`);
}
