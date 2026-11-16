import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { pages, type PageId } from "../utils/navigation";
import { assetUrl } from "../utils/assetUrl";
export default function Header({ page }: { page: PageId }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a
        href="#/pesan-perjalanan"
        className="brand"
        aria-label="Meputrip beranda"
      >
        <img src={assetUrl("/images/logo_mepu.png")} alt="" />
      </a>
      <nav
        id="primary-navigation"
        className={open ? "nav open" : "nav"}
        aria-label="Navigasi utama"
      >
        {pages.map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a
        className="header-cta"
        href="#/pesan-perjalanan/custom-trip"
        onClick={() => setOpen(false)}
      >
        Rencanakan trip <ArrowUpRight size={15} />
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
