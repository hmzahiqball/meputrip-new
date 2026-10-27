import { useState } from "react";
import { ArrowUpRight, Menu, X, Compass } from "lucide-react";
const links = [
  ["Home", "#home"],
  ["Destinasi", "#destinasi"],
  ["Open Trip", "#open-trip"],
  ["Custom Trip", "#custom-trip"],
  ["About Us", "#tentang"],
  ["Contact", "#kontak"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a href="#home" className="brand" aria-label="Meputrip beranda">
        <Compass size={29} />
        <span>
          mepu<span className="brand-light">trip.</span>
        </span>
      </a>
      <nav className={open ? "nav open" : "nav"} aria-label="Navigasi utama">
        {links.map(([name, url]) => (
          <a key={url} href={url} onClick={() => setOpen(false)}>
            {name}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#custom-trip">
        Rencanakan trip <ArrowUpRight size={15} />
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
