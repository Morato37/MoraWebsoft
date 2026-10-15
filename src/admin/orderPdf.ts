import jsPDF from 'jspdf';
import type { Order } from './types';

export function downloadOrderPdf(order: Order): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const width = 210;
  const margin = 20;
  const customer = order.admin_customers;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 188, 212);
  doc.text('MoraWebsoft', margin, 20);
  doc.setFontSize(26);
  doc.setTextColor(40, 40, 60);
  doc.text('AUFTRAG', margin, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 150);
  doc.text(`Datum: ${new Date(order.order_date).toLocaleDateString('de-CH')}`, width - margin, 20, { align: 'right' });
  doc.text(`Status: ${order.status}`, width - margin, 26, { align: 'right' });

  doc.setDrawColor(0, 188, 212);
  doc.setLineWidth(0.7);
  doc.line(margin, 50, width - margin, 50);

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 150);
  doc.text('KUNDE', margin, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 60);
  doc.text(customer?.name ?? '—', margin, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (customer?.company) doc.text(customer.company, margin, 77);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(40, 40, 60);
  doc.text(order.title, margin, 105);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 150);
  doc.text('AUFTRAGSDETAILS', margin, 120);
  doc.setDrawColor(220, 220, 230);
  doc.line(margin, 124, width - margin, 124);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 60);
  doc.text(`Auftragsdatum: ${new Date(order.order_date).toLocaleDateString('de-CH')}`, margin, 136);
  doc.text(`Bearbeitungsstatus: ${order.status}`, margin, 144);

  if (order.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 150);
    doc.text('NOTIZEN', margin, 162);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 60);
    doc.text(doc.splitTextToSize(order.notes, width - margin * 2), margin, 170);
  }

  doc.setDrawColor(0, 188, 212);
  doc.line(margin, 282, width - margin, 282);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 150);
  doc.text('MoraWebsoft · matteo@morawebsoft.com · 8630 Rüti ZH', width / 2, 288, { align: 'center' });
  doc.save(`${order.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'auftrag'}.pdf`);
}
