import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Generator from './pages/Generator';
import Verifier from './pages/Verifier';

export default function App() {
  return (
    <div className="app">
      <header className="nav">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 100 100" width="26" height="26" aria-hidden="true">
              <rect width="100" height="100" rx="20" fill="#0a0f1e" />
              <rect x="15" y="28" width="70" height="44" rx="8" fill="#d4af37" />
              <circle cx="35" cy="46" r="8" fill="#0a0f1e" />
              <rect x="52" y="40" width="24" height="4" rx="2" fill="#0a0f1e" />
              <rect x="52" y="50" width="18" height="4" rx="2" fill="#0a0f1e" />
            </svg>
          </span>
          <span className="brand-name">ID<b>FORGE</b></span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" className={n => n.className} end>Home</NavLink>
          <NavLink to="/generate" className={n => n.className}>Generate</NavLink>
          <NavLink to="/verify" className={n => n.className}>Verify</NavLink>
          <NavLink to="/generate" className="nav-cta">Create ID →</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/verify" element={<Verifier />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <div>
            <div className="brand-name small">ID<b>FORGE</b></div>
            <div className="foot-tag">Documents forged to pass. Verified in seconds.</div>
          </div>
          <div className="foot-note">
            Demo documents only — Republic of Atlas, State of Caldera &amp; Novara are fictional issuing states.
            Not a real government credential.
          </div>
          <div className="foot-copy">© {new Date().getFullYear()} IDForge · ICAO-9303 valid MRZ · Real scannable barcodes</div>
        </div>
      </footer>
    </div>
  );
}
