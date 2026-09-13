import { DocData, docPayload, licenseCheckDigit } from '../lib/documents';
import QRCode from 'react-qr-code';

const INK = '#2b2b33';
const BLUE = '#1c3fa0';

/* Deterministic linear barcode from the serial — same number, same bars. */
function Bar({ seed, h = 22 }: { seed: string; h?: number }) {
  const bars: { x: number; w: number }[] = [];
  let x = 2;
  for (let i = 0; i < seed.length * 3; i++) {
    const c = seed.charCodeAt(i % seed.length) * (i + 7) + i * 31;
    const w = 1 + (c % 3);
    bars.push({ x, w });
    x += w + 1 + ((c >> 2) % 2);
  }
  return (
    <svg viewBox={`0 0 ${x} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width={x} height={h} fill="#fff" />
      {bars.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height={h} fill="#111" />)}
    </svg>
  );
}

function Bear({ color = '#d2a72e', x = 0, y = 0 }: { color?: string; x?: number; y?: number }) {
  return (
    <svg viewBox="0 0 100 100" x={x} y={y} width="64" height="64" style={{ display: 'block' }} aria-hidden="true">
      <g fill={color}>
        <circle cx="28" cy="30" r="10" />
        <circle cx="70" cy="30" r="10" />
        <ellipse cx="49" cy="45" rx="30" ry="22" />
        <circle cx="36" cy="78" r="9" />
        <circle cx="55" cy="80" r="9" />
        <circle cx="74" cy="76" r="9" />
        <ellipse cx="49" cy="52" rx="14" ry="11" fill="#e8d27a" />
        <circle cx="38" cy="42" r="2.4" fill="#3a2a10" />
        <circle cx="60" cy="42" r="2.4" fill="#3a2a10" />
        <circle cx="49" cy="50" r="3" fill="#3a2a10" />
        <path d="M20 60 L8 84 L28 78 Z" />
        <path d="M78 60 L92 84 L72 78 Z" />
        <path d="M49 4 l4 8 l8 1 l-6 6 l2 9 l-8 -5 l-8 5 l2 -9 l-6 -6 l8 -1 z" />
      </g>
    </svg>
  );
}

/* Faded California outline — background art */
function CaMap() {
  return (
    <svg viewBox="0 0 200 300" width="150" height="225" style={{ display: 'block', opacity: 0.16 }} aria-hidden="true">
      <path d="M96 8 L150 14 L158 40 L150 90 L138 160 L118 230 L104 288 L96 292 L88 288 L96 220 L100 150 L92 90 L84 40 Z"
        fill="none" stroke="#7a6a4a" strokeWidth="2" />
    </svg>
  );
}

function Floral() {
  return (
    <svg viewBox="0 0 120 60" width="120" height="60" style={{ display: 'block' }} aria-hidden="true">
      <g opacity="0.55">
        {[14, 44, 74, 104].map((cx, i) => (
          <g key={i} transform={`translate(${cx} ${30 + (i % 2) * 8})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-9" rx="4.5" ry="9" fill={i % 2 ? '#d98a9a' : '#e8b8c4'} transform={`rotate(${a})`} />
            ))}
            <circle r="4" fill="#f2d9a8" />
          </g>
        ))}
        <path d="M0 44 Q 60 30 120 46" stroke="#9a7a5a" strokeWidth="1" fill="none" opacity="0.6" />
      </g>
    </svg>
  );
}

function Stamp() {
  return (
    <div className="ca-stamp" aria-hidden="true">
      <div className="ca-stamp-red" />
      <div className="ca-stamp-word">VETERAN</div>
      <div className="ca-stamp-green" />
    </div>
  );
}

export default function DriverLicense({ doc }: { doc: DocData }) {
  const p = doc.person;
  const cd = licenseCheckDigit(doc.docNumber);
  const dobMMDDYYYY = p.birthDate.replace(/-/g, '');

  return (
    <div className="doc-stack">
      {/* ================= FRONT ================= */}
      <div className="card ca-front" data-docfront>
        <div className="ca-ca" aria-hidden="true"><CaMap /></div>
        <div className="ca-bear" aria-hidden="true"><Bear /></div>
        <div className="ca-floral" aria-hidden="true"><Floral /></div>

        <div className="ca-head">
          <div className="ca-name">
            California<span className="ca-usa">USA</span>
          </div>
          <div className="ca-kind">DRIVER LICENSE</div>
          <div className="ca-rule" />
        </div>

        <div className="ca-main">
          <div className="ca-left">
            <div className="ca-photo">
              {doc.photo ? <img src={doc.photo} alt="ID photo" /> : <div className="photo-ph">PHOTO</div>}
            </div>
            <div className="ca-donor"><span className="ca-donor-txt">DONOR</span></div>
            <div className="ca-stampwrap"><Stamp /></div>
          </div>

          <div className="ca-grid">
            <div className="ca-f"><span className="ca-l">DL</span><span className="ca-v">{doc.docNumber}</span></div>
            <div className="ca-f"><span className="ca-l">EXP</span><span className="ca-v">{doc.expiryDate}</span></div>
            <div className="ca-f"><span className="ca-l">LN</span><span className="ca-v">{p.lastName}</span></div>
            <div className="ca-f"><span className="ca-l">FN</span><span className="ca-v">{p.firstName}</span></div>
            <div className="ca-f ca-f-wide"><span className="ca-l">RSTR</span><span className="ca-v">NONE</span></div>

            <div className="ca-f"><span className="ca-l">DOB</span><span className="ca-v">{dobMMDDYYYY}</span></div>
            <div className="ca-f"><span className="ca-l">SEX</span><span className="ca-v">{p.sex}</span></div>
            <div className="ca-f"><span className="ca-l">HGT</span><span className="ca-v">{p.height} CM</span></div>
            <div className="ca-f"><span className="ca-l">HAIR</span><span className="ca-v">BRN</span></div>
            <div className="ca-f"><span className="ca-l">EYES</span><span className="ca-v">{p.eyeColor}</span></div>
            <div className="ca-f"><span className="ca-l">WGT</span><span className="ca-v">{p.height ? Math.round(p.height * 0.45) : 75} KG</span></div>
            <div className="ca-f"><span className="ca-l">ISS</span><span className="ca-v">{doc.issueDate}</span></div>
            <div className="ca-f ca-f-donum"><span className="ca-dl">DONUM</span></div>

            <div className="ca-classrow">
              <span className="ca-l">CLASS</span><span className="ca-v ca-classv">C</span>
              <span className="ca-l ca-endl">END</span><span className="ca-v">NONE</span>
            </div>
          </div>
        </div>

        <div className="ca-micro">CALIFORNIA · DRIVER LICENSE · {doc.docNumber} · {p.lastName} {p.firstName} · CALIFORNIA · DRIVER LICENSE · {doc.docNumber} · CALIFORNIA</div>
      </div>

      {/* ================= BACK ================= */}
      <div className="card ca-back">
        <div className="ca-backbar"><Bar seed={doc.docNumber + cd} h={30} /></div>
        <div className="ca-magstripe" aria-hidden="true" />
        <div className="ca-backbody">
          <div className="ca-backleft">
            <div><b>CLASS:</b> C - Veh w/GVWR &lt;26000, No M/C</div>
            <div><b>ENDORSEMENTS:</b> None</div>
            <div><b>RESTRICTIONS:</b> None</div>
          </div>
          <div className="ca-backright">
            <p>This card is not acceptable for official federal purposes. This license is issued only as a license to drive a motor vehicle. It does not establish eligibility for employment, voter registration, or public benefits.</p>
          </div>
        </div>
        <div className="ca-back2d">
          <div className="ca-2d-cap">2D BARCODE</div>
          <div className="ca-2d-box"><QRCode value={docPayload(doc)} size={118} fgColor="#101418" bgColor="#ffffff" /></div>
        </div>
      </div>
    </div>
  );
}
