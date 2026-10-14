import type { Invoice, InvoiceItem } from './types';

function formatCHF(val: number) {
  return `CHF ${val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-CH');
}

const LOGO_PATH = '/favicon.svg';
const ETH_QR_PATH = '/eth-qr.png';
const SOL_QR_PATH = '/sol-qr.png';

type InvoiceAssets = {
  logo: string;
  ethQr: string;
  solQr: string;
};

async function assetToDataUrl(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Bild konnte nicht geladen werden: ${path}`);

  const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return `data:${contentType};base64,${btoa(binary)}`;
}

export function generateInvoiceHtml(invoice: Invoice, items: InvoiceItem[], assets: InvoiceAssets): string {
  const customer = invoice.admin_customers;

  const itemRows = items.map((item, i) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 8px; color: #94a3b8; font-family: monospace; font-size: 12px;">${i + 1}</td>
      <td style="padding: 10px 8px; color: #334155; font-size: 13px;">${item.description}</td>
      <td style="padding: 10px 8px; text-align: right; color: #64748b; font-family: monospace; font-size: 13px;">${item.quantity}</td>
      <td style="padding: 10px 8px; text-align: right; color: #64748b; font-family: monospace; font-size: 13px;">${formatCHF(item.unit_price)}</td>
      <td style="padding: 10px 8px; text-align: right; color: #0891b2; font-family: monospace; font-size: 13px; font-weight: 600;">${formatCHF(item.total)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Rechnung ${invoice.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #ffffff; color: #1e293b; font-family: 'Inter', system-ui, sans-serif; padding: 48px; min-height: 100vh; }
  @media print {
    body { padding: 24px; }
    .no-print { display: none !important; }
    @page { margin: 1.5cm; }
  }
</style>
</head>
<body>
<div style="max-width: 720px; margin: 0 auto;">

  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
    <div>
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;"><img src="${assets.logo}" alt="MoraWebsoft Logo" style="width: 34px; height: 34px; object-fit: contain; display: block;" /><span style="font-size: 18px; font-weight: 800; color: #1e293b;">MoraWebsoft</span></div>
      <div style="font-size: 32px; font-weight: 900; color: #1e293b; letter-spacing: -1px;">RECHNUNG</div>
    </div>
    <div style="text-align: right; font-family: monospace; font-size: 12px; color: #64748b;">
      <div style="font-size: 20px; font-weight: 700; color: #0891b2; margin-bottom: 4px;">${invoice.invoice_number}</div>
      <div>Ausgestellt: ${formatDate(invoice.issue_date)}</div>
      <div>Fällig: ${formatDate(invoice.due_date)}</div>
    </div>
  </div>

  <!-- Divider -->
  <div style="height: 1px; background: linear-gradient(90deg, #0891b2, transparent); margin-bottom: 36px;"></div>

  <!-- Billing info -->
  <div style="display: flex; gap: 48px; margin-bottom: 36px;">
    <div>
      <div style="font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; margin-bottom: 10px;">VON</div>
      <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">Matteo Mora</div>
      <div style="font-size: 13px; color: #64748b; line-height: 1.7;">
        MoraWebsoft<br/>
        8630 Rüti ZH<br/>
        matteo@morawebsoft.com
      </div>
    </div>
    <div>
      <div style="font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; margin-bottom: 10px;">AN</div>
      <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">${customer?.name ?? ''}</div>
      <div style="font-size: 13px; color: #64748b; line-height: 1.7;">
        ${customer?.company ? `${customer.company}<br/>` : ''}
        ${customer?.address ? `${customer.address}<br/>` : ''}
        ${customer?.email ?? ''}
      </div>
    </div>
  </div>

  <!-- Items table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <th style="padding: 10px 8px; text-align: left; font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; font-weight: 600;">#</th>
        <th style="padding: 10px 8px; text-align: left; font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; font-weight: 600;">BESCHREIBUNG</th>
        <th style="padding: 10px 8px; text-align: right; font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; font-weight: 600;">MENGE</th>
        <th style="padding: 10px 8px; text-align: right; font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; font-weight: 600;">EINZELPREIS</th>
        <th style="padding: 10px 8px; text-align: right; font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; font-weight: 600;">TOTAL</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
    <div style="min-width: 260px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        <span>Zwischensumme</span><span style="font-family: monospace;">${formatCHF(invoice.subtotal)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        <span>MwSt. ${invoice.tax_rate}%</span><span style="font-family: monospace;">${formatCHF(invoice.tax_amount)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 16px; font-weight: 800; color: #1e293b;">
        <span>Gesamtbetrag</span><span style="color: #0891b2; font-family: monospace;">${formatCHF(invoice.total)}</span>
      </div>
    </div>
  </div>

  ${invoice.notes ? `
  <!-- Notes -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 32px;">
    <div style="font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; margin-bottom: 8px;">NOTIZEN</div>
    <p style="font-size: 13px; color: #64748b; line-height: 1.6;">${invoice.notes}</p>
  </div>` : ''}

  <!-- Payment info -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
    <div style="font-family: monospace; font-size: 10px; color: #94a3b8; letter-spacing: 2px; margin-bottom: 16px;">ZAHLUNGSDETAILS</div>

    <div style="display: flex; gap: 32px; flex-wrap: wrap;">
      <!-- Bank / IBAN -->
      <div style="flex: 1; min-width: 200px;">
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Zahlungskonditionen</div>
        <div style="font-size: 13px; color: #334155; margin-bottom: 12px;">30 Tage netto</div>

        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Zahlbar an</div>
        <div style="font-family: monospace; font-size: 12px; color: #334155; letter-spacing: 1px;">CH13 0025 3253 1033 33M1 H</div>
      </div>

      <!-- Crypto QRs -->
      <div style="display: flex; gap: 20px; align-items: flex-start;">
        <div style="text-align: center;">
          <img src="${assets.ethQr}" alt="ETH QR Code" style="width: 80px; height: 80px; object-fit: contain; display: block; margin-bottom: 6px;" />
          <div style="font-family: monospace; font-size: 9px; color: #94a3b8; letter-spacing: 1px;">ETH</div>
          <div style="font-family: monospace; font-size: 8px; color: #cbd5e1; max-width: 80px; word-break: break-all; margin-top: 2px;">0x4449...26cB</div>
        </div>
        <div style="text-align: center;">
          <img src="${assets.solQr}" alt="SOL QR Code" style="width: 80px; height: 80px; object-fit: contain; display: block; margin-bottom: 6px;" />
          <div style="font-family: monospace; font-size: 9px; color: #94a3b8; letter-spacing: 1px;">SOL</div>
          <div style="font-family: monospace; font-size: 8px; color: #cbd5e1; max-width: 80px; word-break: break-all; margin-top: 2px;">DGR7...gK2F</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="height: 1px; background: linear-gradient(90deg, #0891b2, transparent); margin-bottom: 16px;"></div>
  <div style="font-family: monospace; font-size: 11px; color: #94a3b8; text-align: center;">
    MoraWebsoft &nbsp;·&nbsp; matteo@morawebsoft.com &nbsp;·&nbsp; 8630 Rüti ZH
  </div>

  <!-- Print button -->
  <div class="no-print" style="text-align: center; margin-top: 40px;">
    <button onclick="window.print()"
      style="padding: 12px 32px; background: #0891b2; color: #ffffff; font-family: monospace; font-weight: 700; font-size: 13px; border: none; border-radius: 8px; cursor: pointer;">
      Als PDF speichern / Drucken
    </button>
  </div>

</div>
</body>
</html>`;
}

export async function openInvoicePdf(invoice: Invoice, items: InvoiceItem[]) {
  const [logo, ethQr, solQr] = await Promise.all([
    assetToDataUrl(LOGO_PATH),
    assetToDataUrl(ETH_QR_PATH),
    assetToDataUrl(SOL_QR_PATH),
  ]);
  const html = generateInvoiceHtml(invoice, items, { logo, ethQr, solQr });
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) win.focus();
}
