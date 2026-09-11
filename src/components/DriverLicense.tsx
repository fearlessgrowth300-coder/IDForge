import { DOC_META, DocData, docPayload, licenseCheckDigit } from '../lib/documents';
import { toMrz } from '../lib/mrz';
import Guilloche from './Guilloche';
import QrBox from './QrBox';

const MRZ_FONT = "'OCR A', 'JetBrains Mono', monospace";

export default function DriverLicense({ doc }: { doc: DocData }) {
  const meta = DOC_META[doc.type];
  const p = doc.person;
  const cd = licenseCheckDigit(doc.docNumber);
  // ADT-style pseudo-MRZ strip (2 lines x 30, not ICAO — licenses vary by state)
  const l1 = (toMrz('DL', 2) + toMrz(p.lastName, 12) + toMrz(p.firstName, 16)).slice(0, 30);
  const l2 = (toMrz(doc.docNumber, 9) + cd + toMrz(p.birthDate.slice(2), 6) + toMrz(p.nationality, 3) + toMrz('CLASS D', 8)).slice(0, 30);

  return (
    <div className="doc-stack">
      <div className="card license" data-docfront>
        <Guilloche color="rgba(30,90,180,0.18)" />
        <div className="lic-band" />
        <div className="lic-header">
          <div>
            <div className="lic-state">{meta.country}</div>
            <div className="lic-kind">DRIVER LICENSE</div>
          </div>
          <div className="lic-flag">
            <div className="lic-star">★</div>
          </div>
        </div>

        <div className="lic-body">
          <div className="lic-photo">
            {doc.photo ? <img src={doc.photo} alt="ID photo" /> : <div className="photo-ph">PHOTO</div>}
            <div className="photo-seal">AUTHENTICATED</div>
          </div>
          <div className="lic-fields">
            <Field label="LAST NAME" value={p.lastName} />
            <div className="row2">
              <Field label="FIRST NAME" value={p.firstName} />
              <Field label="MIDDLE" value={p.middleName} />
            </div>
            <div className="row2">
              <Field label="DOB" value={p.birthDate} />
              <Field label="SEX" value={p.sex} />
            </div>
            <div className="row2">
              <Field label="HEIGHT" value={p.height + ' CM'} />
              <Field label="EYES" value={p.eyeColor} />
            </div>
            <div className="row2">
              <Field label="ISSUE" value={doc.issueDate} />
              <Field label="EXPIRES" value={doc.expiryDate} />
            </div>
          </div>
          <div className="lic-right">
            <div className="lic-class">
              <div className="lic-class-label">CLASS</div>
              <div className="lic-class-val">D</div>
            </div>
            <QrBox value={docPayload(doc)} size={84} />
            <div className="lic-blood">{p.bloodType} <span className="lic-blood-sub">BLOOD</span></div>
          </div>
        </div>

        <div className="mrz-strip">
          <div className="mrz-line" style={{ fontFamily: MRZ_FONT }}>{l1}</div>
          <div className="mrz-line" style={{ fontFamily: MRZ_FONT }}>{l2}</div>
        </div>
        <div className="holo holo-lic" aria-hidden="true"><span>ID</span><span>ID</span><span>ID</span></div>
        <div className="microtext">IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE</div>
        <div className="lic-serial">NO. {doc.docNumber}</div>
      </div>

      <div className="card license-back">
        <Guilloche color="rgba(30,90,180,0.14)" />
        <div className="back-title">{meta.country} — DRIVER LICENSE (BACK)</div>
        <div className="back-notes">
          <p>If your license is lost or stolen, report to any licensing office.</p>
          <p>This credential may only be reproduced with the bearer's written consent.</p>
          <p>Specifications per state motor vehicle code §47-112.</p>
        </div>
        <div className="back-stripes" aria-hidden="true" />
        <div className="back-foot">IDFORGE SECURE DOCUMENT SYSTEM · {doc.docNumber}-{cd}</div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="lic-f">
      <div className="lic-f-label">{label}</div>
      <div className="lic-f-val">{value || '—'}</div>
    </div>
  );
}
