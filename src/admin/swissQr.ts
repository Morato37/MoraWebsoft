import type { Customer } from './types';

export const CREDITOR = {
  iban: 'CH1300253253103333M1H',
  name: 'Matteo Mora',
  street: 'Alt Ferrachstrasse',
  houseNumber: '37',
  postalCode: '8630',
  town: 'Rüti',
  country: 'CH',
} as const;

export interface SwissQrInput {
  invoiceNumber: string;
  total: number | null | undefined;
  customer?: Pick<Customer, 'name' | 'company' | 'street' | 'house_number' | 'postal_code' | 'town' | 'country'> | null;
}

const MAX = {
  name: 70,
  street: 70,
  houseNumber: 16,
  postalCode: 16,
  town: 35,
  unstructured: 140,
} as const;

function clean(value: string | null | undefined, maxLength: number): string {
  return (value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[“”„]/g, '"')
    .replace(/[‘’‚]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿĀ-ɏ0-9\s.,'\/&()+:;!?@#%\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function alphaNumeric(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function mod97(value: string): number {
  let remainder = 0;
  for (const digit of value) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder;
}

function lettersToDigits(value: string): string {
  return [...value].map(character => /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character).join('');
}

export function buildScorReference(invoiceNumber: string): string {
  const basis = alphaNumeric(invoiceNumber).slice(0, 21);
  if (!basis) throw new Error('Die Rechnungsnummer enthält keine gültigen Zeichen für eine SCOR-Referenz.');
  const checkDigits = String(98 - mod97(lettersToDigits(`${basis}RF00`))).padStart(2, '0');
  return `RF${checkDigits}${basis}`;
}

function isValidIban(iban: string): boolean {
  const normalized = alphaNumeric(iban);
  if (!/^(CH|LI)[0-9A-Z]{19}$/.test(normalized)) return false;
  if (/^(CH|LI)\d{2}3(?:0\d{3}|1\d{3})/.test(normalized)) return false;
  return mod97(lettersToDigits(`${normalized.slice(4)}${normalized.slice(0, 4)}`)) === 1;
}

function isValidScor(reference: string): boolean {
  if (!/^RF\d{2}[A-Z0-9]+$/.test(reference)) return false;
  return mod97(lettersToDigits(`${reference.slice(4)}${reference.slice(0, 4)}`)) === 1;
}

function formatAmount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  if (value < 0.01 || value > 999999999.99) throw new Error('Der Rechnungsbetrag muss zwischen CHF 0.01 und CHF 999’999’999.99 liegen.');
  return value.toFixed(2);
}

function customerFields(customer: SwissQrInput['customer']): string[] {
  if (!customer) return ['', '', '', '', '', '', ''];
  const name = clean(customer.company || customer.name, MAX.name);
  const street = clean(customer.street, MAX.street);
  const houseNumber = clean(customer.house_number, MAX.houseNumber);
  const postalCode = clean(customer.postal_code, MAX.postalCode);
  const town = clean(customer.town, MAX.town);
  const country = clean(customer.country || 'CH', 2).toUpperCase();
  if (!name || !postalCode || !town || !/^[A-Z]{2}$/.test(country)) return ['', '', '', '', '', '', ''];
  return ['S', name, street, houseNumber, postalCode, town, country];
}

export function buildSwissQrPayload(input: SwissQrInput): string {
  const amount = formatAmount(input.total);
  const debtor = customerFields(input.customer);
  const reference = buildScorReference(input.invoiceNumber);
  const lines = [
    'SPC',
    '0200',
    '1',
    alphaNumeric(CREDITOR.iban),
    'S',
    clean(CREDITOR.name, MAX.name),
    clean(CREDITOR.street, MAX.street),
    clean(CREDITOR.houseNumber, MAX.houseNumber),
    clean(CREDITOR.postalCode, MAX.postalCode),
    clean(CREDITOR.town, MAX.town),
    clean(CREDITOR.country, 2).toUpperCase(),
    '', '', '', '', '', '', '',
    amount,
    'CHF',
    ...debtor,
    'SCOR',
    reference,
    clean(`Rechnung ${input.invoiceNumber}`, MAX.unstructured),
    'EPD',
  ];
  const payload = lines.join('\n');
  validateSwissQr({ ...input, payload });
  return payload;
}

export function validateSwissQr(input: SwissQrInput & { payload?: string }): void {
  const payload = input.payload ?? buildSwissQrPayloadWithoutValidation(input);
  const lines = payload.split('\n');
  if (lines.length !== 31) throw new Error(`Der Swiss QR Code enthält ${lines.length} statt 31 Zeilen.`);
  if (!isValidIban(lines[3])) throw new Error('Die hinterlegte IBAN ist ungültig oder eine QR-IBAN.');
  if (lines[17] && !/^\d{1,9}\.\d{2}$/.test(lines[17])) throw new Error('Der Betrag im Swiss QR Code ist ungültig.');
  if (lines[27] !== 'SCOR') throw new Error('Der Referenztyp muss SCOR sein.');
  if (!isValidScor(lines[28])) throw new Error('Die SCOR-Referenz ist ungültig.');
  if (lines[30] !== 'EPD') throw new Error('Der Swiss QR Code endet nicht mit EPD.');
  if (payload.length > 997) throw new Error('Der Swiss QR-Code-Inhalt ist länger als 997 Zeichen.');
}

function buildSwissQrPayloadWithoutValidation(input: SwissQrInput): string {
  const amount = formatAmount(input.total);
  const debtor = customerFields(input.customer);
  const reference = buildScorReference(input.invoiceNumber);
  return [
    'SPC', '0200', '1', alphaNumeric(CREDITOR.iban), 'S',
    clean(CREDITOR.name, MAX.name), clean(CREDITOR.street, MAX.street), clean(CREDITOR.houseNumber, MAX.houseNumber),
    clean(CREDITOR.postalCode, MAX.postalCode), clean(CREDITOR.town, MAX.town), clean(CREDITOR.country, 2).toUpperCase(),
    '', '', '', '', '', '', '', amount, 'CHF', ...debtor, 'SCOR', reference,
    clean(`Rechnung ${input.invoiceNumber}`, MAX.unstructured), 'EPD',
  ].join('\n');
}

export function formatQrAmount(value: number): string {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

if (import.meta.env.DEV) {
  console.assert(buildScorReference('539007547034') === 'RF18539007547034');
  console.assert(buildScorReference('RE-2026-0042') === 'RF97RE20260042');
  const testPayload = buildSwissQrPayload({
    invoiceNumber: 'RE-2026-0042',
    total: 1234.5,
    customer: { name: 'Muster AG', company: '', street: 'Bahnhofstrasse', house_number: '42', postal_code: '8001', town: 'Zürich', country: 'CH' },
  });
  const testLines = testPayload.split('\n');
  console.assert(testLines.length === 31);
  console.assert(testLines[18] === '1234.50');
  console.assert(testLines[20] === 'S');
  console.assert(testLines[27] === 'SCOR');
  console.assert(testLines[28] === 'RF97RE20260042');
  console.assert(testLines[30] === 'EPD');
}
