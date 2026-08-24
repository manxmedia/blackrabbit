"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

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

        <div className="header-actions desktop-cta">
          <a
            className="header-icon-btn whatsapp-btn"
            href="https://api.whatsapp.com/send/?phone=27836882899&text=Hi+I+have+a+query%2C+please+help"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            title="WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="whatsapp-icon"
            >
              <path
                fill="currentColor"
                d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.09.55 4.13 1.59 5.94L.13 24l6.36-1.67a11.8 11.8 0 0 0 5.59 1.41h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.42ZM12.09 21.8h-.01a9.94 9.94 0 0 1-5.07-1.39l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.92 9.92 0 1 1 8.43 4.66Zm5.45-7.44c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.95-2.28-.25-.6-.5-.52-.69-.53h-.59c-.2 0-.53.08-.81.38-.28.3-1.06 1.03-1.06 2.51s1.08 2.91 1.23 3.11c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z"
              />
            </svg>
          </a>

          <a
            className="header-icon-btn call-btn"
            href="tel:+27836882899"
            aria-label="Call us"
            title="Call us"
          >
            <Phone size={19} strokeWidth={2.2} />
          </a>

          <a
            className="btn-getstarted"
            href="#contact"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}
