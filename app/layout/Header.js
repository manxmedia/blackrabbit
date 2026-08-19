"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menu, setMenu] = useState(false);

  const closeMobileMenu = () => setMenu(false);

  return (
<header className="header d-flex align-items-center fixed-top">
      <div className="container-xl d-flex align-items-center justify-content-between">

        <a
          href="#hero"
          className="logo"
          aria-label="Black Rabbit Aerials home"
          onClick={closeMobileMenu}
        >
          <img
            src="/assets/img/logo.png"
            alt="Black Rabbit Aerials"
          />
        </a>

        <button
          className="mobile-nav-toggle d-xl-none"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
          type="button"
        >
          {menu ? <X size={30} /> : <Menu size={30} />}
        </button>

        <nav
          className={`navmenu ${menu ? "mobile-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#hero" onClick={closeMobileMenu}>
            Home
          </a>

          <a href="#about" onClick={closeMobileMenu}>
            About
          </a>

          <a href="#services" onClick={closeMobileMenu}>
            Services
          </a>

          <a href="#portfolio" onClick={closeMobileMenu}>
            Our Work
          </a>

          <a href="#contact" onClick={closeMobileMenu}>
            Contact
          </a>
        </nav>

        <a
          className="btn-getstarted desktop-cta"
          href="#contact"
        >
          Get a Quote
        </a>
      </div>
    </header>
  );
}
