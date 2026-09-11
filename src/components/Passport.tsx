import Guilloche from './Guilloche';
import QrBox from './QrBox';
import { DocData } from '../lib/documents';
import { buildPassportMrz, dateToYyMmDd } from '../lib/mrz';

function fmt(dateStr: string): string {
  if (!dateStr) return '— — —';
  const [y, m, d] = dateStr.split('-');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function Passport({ data }: { data: DocData }) {
  const p = data.person;
  const [l1, l2] = buildPassportMrz({
    docType: 'P',
    country: 'ATL',
    surname: p.lastName,
    givenNames: p.firstName + (p.middleName ? '<' + p.middleName : ''),
    docNumber: data.docNumber,
    nationality: p.nationality || 'ATL',
    dob: p.birthDate,
    sex: p.sex,
    expiry: data.expiryDate,
    issueDate: data.issueDate,
  });
  return (
    <div className="passport">
      <div className="pp-cover">
        <div className="pp-emblem">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#d4af37" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="24" fill="none" stroke="#d4af37" strokeWidth="1" />
            <path d="M32 12 L36 28 L52 28 L39 37 L43 52 L32 43 L21 52 L25 37 L12 28 L28 28 Z" fill="#d4af37" />
          </svg>
        </div>
        <div className="pp-cover-title">REPUBLIC OF ATLAS</div>
        <div className="pp-cover-sub">BIOMETRIC PASSPORT</div>
        <div className="pp-chip-icon">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="#d4af37" strokeWidth="1.5" />
            <path d="M8 12h8M12 8v8" stroke="#d4af37" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="pp-page">
        <Guilloche color="rgba(28,60,110,0.14)" className="pp-bg" />
        <div className="pp-head">
          <span className="pp-flag">🛡</span>
          <div>
            <div className="pp-head-main">REPUBLIC OF ATLAS · BIOMETRIC PASSPORT</div>
            <div className="pp-head-sub">PASSPORT / PASSEPORT / PASSPORT</div>
          </div>
          <div className="pp-type-box">P</div>
        </div>
        <div className="pp-body">
          <div className="pp-photo">
            {data.photo ? (
              <img src={data.photo} alt="holder" />
            ) : (
              <div className="pp-photo-ph">
                <svg viewBox="0 0 24 24" width="44" height="44"><circle cx="12" cy="8" r="4" fill="none" stroke="#7c8aa5" strokeWidth="1.5" /><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="none" stroke="#7c8aa5" strokeWidth="1.5" /></svg>
              </div>
            )}
            <div className="pp-photo-frame" />
          </div>
          <div className="pp-fields">
            {[
              ['Surname', p.lastName || '—'],
              ['Given names', [p.firstName, p.middleName].filter(Boolean).join(' ') || '—'],
              ['National ID No.', data.docNumber],
              ['Nationality', (p.nationality || 'ATL').toUpperCase()],
              ['Date of birth', fmt(p.birthDate)],
              ['Sex', p.sex === 'M' ? 'Male' : 'Female'],
              ['Date of issue', fmt(data.issueDate)],
              ['Date of expiry', fmt(data.expiryDate)],
            ].map(([k, v]) => (
              <div className="pp-field" key={k}>
                <div className="pp-field-k">{k}</div>
                <div className="pp-field-v">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pp-mrz">
          <div>{l1}</div>
          <div>{l2}</div>
        </div>
      </div>
      <div className="pp-foot">
        <QrBox value={JSON.stringify({ app: 'IDForge', v: 1, type: 'passport', serial: data.docNumber })} size={54} />
        <div className="pp-foot-text">
          <div>{dateToYyMmDd(data.issueDate)} · ISSUED AT ATLAS CIVIL REGISTRY</div>
          <div>DOC {data.docNumber}</div>
        </div>
      </div>
    </div>
  );
}
