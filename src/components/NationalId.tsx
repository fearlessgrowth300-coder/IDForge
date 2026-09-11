import { DOC_META, DocData, docPayload } from '../lib/documents';
import Guilloche from './Guilloche';
import QrBox from './QrBox';

export default function NationalId({ doc }: { doc: DocData }) {
  const meta = DOC_META[doc.type];
  const p = doc.person;

  return (
    <div className="doc-stack">
      <div className="card nid" data-docfront>
        <Guilloche color="rgba(160,20,40,0.16)" />
        <div className="nid-top">
          <div className="nid-emblem">
            <div className="nid-emblem-inner">★</div>
          </div>
          <div className="nid-title">
            <div className="nid-country">{meta.country}</div>
            <div className="nid-name">NATIONAL IDENTITY CARD</div>
          </div>
        </div>

        <div className="nid-body">
          <div className="nid-photo">
            {doc.photo ? <img src={doc.photo} alt="ID photo" /> : <div className="photo-ph">PHOTO</div>}
          </div>
          <div className="nid-fields">
            <NF label="SURNAME" value={p.lastName} />
            <NF label="GIVEN NAMES" value={`${p.firstName} ${p.middleName}`.trim()} />
            <NF label="CITIZEN NO" value={doc.docNumber} />
            <NF label="DATE OF BIRTH" value={p.birthDate} />
            <NF label="SEX" value={p.sex === 'M' ? 'MALE' : 'FEMALE'} />
            <NF label="NATIONALITY" value={p.nationality} />
            <NF label="VALID FROM" value={doc.issueDate} />
            <NF label="VALID UNTIL" value={doc.expiryDate} />
          </div>
          <div className="nid-right">
            <QrBox value={docPayload(doc)} size={92} />
            <div className="nid-chip" aria-hidden="true">
              <div className="chip-lines" />
            </div>
          </div>
        </div>

        <div className="nid-band">
          <span className="nid-band-txt">SECURE · CREDIT RATING A+ · IDFORGE {doc.docNumber}</span>
          <div className="nid-holo" aria-hidden="true"><span>CARD</span><span>CARD</span></div>
        </div>
        <div className="microtext">IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE·IDFORGE</div>
      </div>

      <div className="card nid-back">
        <Guilloche color="rgba(160,20,40,0.12)" />
        <div className="back-title">{meta.country} — NATIONAL ID (REVERSE)</div>
        <div className="nid-sign">
          <div className="nid-sign-line" />
          <div className="nid-sign-cap">Authorized signature of issuing authority</div>
        </div>
        <div className="back-notes">
          <p>This card is property of the issuing state and must be surrendered on request.</p>
          <p>Contains a contactless secure element (ISO/IEC 14443) with a signed identity credential.</p>
          <p>Report loss or theft to your nearest identity bureau within 30 days.</p>
        </div>
        <div className="back-foot">IDFORGE SECURE DOCUMENT SYSTEM · {doc.docNumber}</div>
      </div>
    </div>
  );
}

function NF({ label, value }: { label: string; value: string }) {
  return (
    <div className="nid-f">
      <span className="nid-f-label">{label}</span>
      <span className="nid-f-val">{value || '—'}</span>
    </div>
  );
}
