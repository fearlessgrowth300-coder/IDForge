export type DocType = 'passport' | 'drivers-license' | 'national-id';

export interface Person {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;      // YYYY-MM-DD
  sex: 'M' | 'F';
  nationality: string;    // 3-letter code
  height: string;         // cm
  eyeColor: string;
  bloodType: string;
  placeOfIssue: string;
}

export interface DocData {
  type: DocType;
  docNumber: string;
  issueDate: string;      // YYYY-MM-DD
  expiryDate: string;     // YYYY-MM-DD
  person: Person;
  photo?: string | null;  // data URL
}

export const DOC_META: Record<DocType, {
  label: string;
  country: string;
  serialPrefix: string;
  licenseClass?: string;
}> = {
  'passport': { label: 'Passport', country: 'REPUBLIC OF ATLAS', serialPrefix: 'A' },
  'drivers-license': { label: "Driver's License", country: 'STATE OF CALDERA', serialPrefix: 'DL' },
  'national-id': { label: 'National ID', country: 'FED. REPUBLIC OF NOVARA', serialPrefix: 'NI' },
};

export function makeDocNumber(prefix: string, len = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return prefix + s;
}

/** Luhn-ish check digit used on license front (real ADT uses a 15-char check). */
export function licenseCheckDigit(serial: string): string {
  let sum = 0;
  for (let i = 0; i < serial.length; i++) sum += serial.charCodeAt(i) * (i + 1);
  return String(sum % 10);
}

/** JSON payload encoded into the scannable QR/barcode of a generated doc. */
export function docPayload(d: DocData): string {
  return JSON.stringify({
    app: 'IDForge',
    v: 1,
    type: d.type,
    serial: d.docNumber,
    name: `${d.person.firstName} ${d.person.lastName}`.trim(),
    dob: d.person.birthDate,
    issue: d.issueDate,
    expiry: d.expiryDate,
  });
}

export function randomPerson(): Person {
  return {
    firstName: 'ADAM', lastName: 'CARTER', middleName: 'J',
    birthDate: '1988-04-17', sex: 'M', nationality: 'ATL',
    height: '182', eyeColor: 'BR', bloodType: 'O+', placeOfIssue: 'PORT HALE',
  };
}

export function randomSample(type: DocType): DocData {
  const meta = DOC_META[type];
  return {
    type,
    docNumber: makeDocNumber(meta.serialPrefix),
    issueDate: '2024-03-10',
    expiryDate: '2034-03-09',
    person: randomPerson(),
    photo: null,
  };
}
