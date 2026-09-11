import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Passport from '../components/Passport';
import DriverLicense from '../components/DriverLicense';
import NationalId from '../components/NationalId';
import { randomSample } from '../lib/documents';

export default function Landing() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flip, setFlip] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => setFlip(f => !f), 3200);
    return () => clearInterval(iv);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -10, y: x * 14 });
  };

  return (
    <div className="landing">
      {/* NAV */}
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">ID</span>
            <span className="brand-name">ID<span className="brand-gold">Forge</span></span>
          </Link>
          <nav className="nav-links">
            <Link to="/generate">Generate</Link>
            <Link to="/verify">Verify</Link>
            <Link to="/generate" className="btn btn-gold btn-sm">Get started</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">✓ ICAO-9303 valid MRZ · ✓ Real scannable barcodes · ✓ Instant export</div>
          <h1>Forged to pass.<br /><span className="gold">Verified in seconds.</span></h1>
          <p className="hero-sub">
            Generate passports, driver's licenses and national IDs with live-checksummed
            machine-readable zones and genuinely scannable barcodes — then run any document
            through the verifier and get a stamped verdict.
          </p>
          <div className="hero-ctas">
            <Link to="/generate" className="btn btn-gold btn-lg">⚡ Generate ID</Link>
            <Link to="/verify" className="btn btn-ghost btn-lg">🔍 Verify ID</Link>
          </div>
          <div className="hero-mini">
            <div><b>3</b> document types</div>
            <div><b>6</b> live MRZ checksums</div>
            <div><b>100%</b> scannable barcodes</div>
          </div>
        </div>

        <div className="hero-stage" ref={heroRef} onMouseMove={onMove}>
          <div
            className={'hero-doc ' + (flip ? 'hero-doc-flipped' : '')}
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <div className="hero-card">
              <div className="hero-card-front"><Passport data={randomSample('passport')} /></div>
              <div className="hero-card-back"><DriverLicense doc={randomSample('drivers-license')} /></div>
              <div className="hero-card-side"><NationalId doc={randomSample('national-id')} /></div>
            </div>
          </div>
          <div className="hero-glow" aria-hidden="true" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Pick a document</h3>
            <p>Passport, driver's license or national ID. Fill the fields or roll a random person.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Watch it live</h3>
            <p>Every keystroke recomputes ICAO checksums and re-encodes the barcode in real time.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Verify & export</h3>
            <p>Run it through the scanner for a stamped verdict, or export PNG at true 1:1 size.</p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section">
        <h2 className="section-title">Every type, built to standard</h2>
        <div className="gallery">
          <div className="gallery-item">
            <div className="gallery-doc"><Passport data={randomSample('passport')} /></div>
            <div className="gallery-cap"><b>Biometric Passport</b> · ICAO 9303 TD3, 2×44 MRZ, 5 checksums</div>
          </div>
          <div className="gallery-item">
            <div className="gallery-doc gallery-doc-card"><DriverLicense doc={randomSample('drivers-license')} /></div>
            <div className="gallery-cap"><b>Driver's License</b> · ADT check digit, holographic foil, QR payload</div>
          </div>
          <div className="gallery-item">
            <div className="gallery-doc gallery-doc-card"><NationalId doc={randomSample('national-id')} /></div>
            <div className="gallery-cap"><b>National ID</b> · guilloche security paper, secure element, UV band</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <h2>Ready to forge a document that checks out?</h2>
        <p>No sign-up. Everything renders in your browser — nothing is uploaded.</p>
        <Link to="/generate" className="btn btn-gold btn-lg">Start generating →</Link>
      </section>

      <footer className="foot">
        <div>IDForge — demo ID documents. Visually and structurally realistic; not issued by any government.</div>
      </footer>
    </div>
  );
}
