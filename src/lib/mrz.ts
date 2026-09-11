// ICAO 9303 TD3 (passport-style) MRZ generation + validation.
// 2 lines x 44 chars. Checksum digit = sum(char values A=0..Z=35, 0-9=48..57) mod 10.

export interface MrzFields {
  docType: string;         // 'P'
  country: string;         // 3 letters
  surname: string;
  givenNames: string;      // "F<M" middle initial form handled by caller
  docNumber: string;
  nationality: string;     // 3 letters
  dob: string;             // YYMMDD
  sex: string;             // M/F/X
  expiry: string;          // YYMMDD
  issueDate?: string;      // YYMMDD (optional, TD3 line2 pos 29-34 area)
  additional?: string;
}

const MRZ_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<';

export function toMrzChar(c: string): string {
  return MRZ_CHARS.indexOf(c) >= 0 ? c : '<';
}

export function toMrz(value: string, len: number): string {
  const out = (value || '').toUpperCase().split('').map(toMrzChar).join('');
  return (out + '<'.repeat(len)).slice(0, len);
}

export function checksumDigit(str: string): string {
  let sum = 0;
  for (const ch of str) {
    const idx = MRZ_CHARS.indexOf(ch);
    if (idx >= 0) sum += idx;
  }
  return String(sum % 10);
}

export function dateToYyMmDd(dateStr: string): string {
  if (!dateStr) return '<<<<<<';
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return '<<<<<<';
  return m[1].slice(2) + m[2] + m[3];
}

/** Build a valid TD3 passport MRZ (2 x 44). */
export function buildPassportMrz(f: MrzFields): [string, string] {
  const line1 =
    f.docType +
    toMrz(f.country, 3) +
    '<' +
    toMrz(f.surname, 9) +
    '<' +
    toMrz(f.givenNames, 5) +
    '<';
  const l1 = (line1 + checksumDigit(line1.slice(0, 43))).slice(0, 44);

  const docNum = toMrz(f.docNumber, 9);
  const dob = dateToYyMmDd(f.dob);
  const exp = dateToYyMmDd(f.expiry);
  // TD3 line 2: doc(9) check dob(6) check exp(6) check sex pers(14) check secondary(4) = 44
  const body =
    docNum +
    checksumDigit(docNum) +
    dob +
    checksumDigit(dob) +
    exp +
    checksumDigit(exp) +
    (f.sex || 'X') +
    toMrz(f.additional || '', 14);
  const l2 = (body + checksumDigit(body)).slice(0, 44);
  return [l1, l2];
}

export interface MrzValidation {
  pass: boolean;
  errors: string[];
  checks: { label: string; pass: boolean }[];
  data?: Record<string, string>;
}

/** Validate a 2x44 TD3 MRZ. */
export function validateTd3(line1: string, line2: string): MrzValidation {
  const checks: { label: string; pass: boolean }[] = [];
  const l1 = (line1 || '').toUpperCase().replace(/[^A-Z0-9<]/g, '').slice(0, 44);
  const l2 = (line2 || '').toUpperCase().replace(/[^A-Z0-9<]/g, '').slice(0, 44);
  const okLen = l1.length === 44 && l2.length === 44;
  checks.push({ label: 'MRZ structure (2 × 44 chars)', pass: okLen });
  if (!okLen) {
    return { pass: false, errors: ['MRZ must be 2 lines of 44 characters'], checks };
  }
  const c1 = checksumDigit(l1.slice(0, 43)) === l1[43];
  const c2 = checksumDigit(l2.slice(0, 9)) === l2[9];
  const c3 = checksumDigit(l2.slice(10, 16)) === l2[16];
  const c4 = checksumDigit(l2.slice(17, 23)) === l2[23];
  const c5 = checksumDigit(l2.slice(0, 43)) === l2[43];
  const c6 = l1[0] === 'P' || l2[24] === 'M' || l2[24] === 'F' || l2[24] === 'X';
  checks.push(
    { label: 'Line 1 primary checksum', pass: c1 },
    { label: 'Document number checksum', pass: c2 },
    { label: 'Date of birth checksum', pass: c3 },
    { label: 'Expiry date checksum', pass: c4 },
    { label: 'Line 2 composite checksum', pass: c5 },
    { label: 'Sex code valid', pass: c6 },
  );
  return {
    pass: checks.every(c => c.pass),
    errors: checks.filter(c => !c.pass).map(c => c.label + ' failed'),
    checks,
    data: {
      'Document class': l1[0],
      'Issuing state': l1.slice(1, 4),
      Surname: l1.slice(4, 13).replace(/<+$/, ''),
      'Given names': l1.slice(14, 43).replace(/<+$/, ''),
      'Document No.': l2.slice(0, 9).replace(/<+$/, ''),
      'Date of birth': l2.slice(10, 16),
      Sex: l2[24],
      Expiry: l2.slice(17, 23),
    },
  };
}
