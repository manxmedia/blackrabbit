"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AudioLines,
  BadgeCheck,
  Camera,
  CheckCircle,
  Cpu,
  House,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  Phone,
  Plus,
  Satellite,
  Send,
  Speaker,
  UserCheck,
  Wifi,
  X,
  Zap,
} from "lucide-react";

const services = [
  [
    Satellite,
    "DSTV Installations, Repairs & Sales",
    "Professional setup, decoder installations, signal troubleshooting, dish alignment, ExtraView and repairs.",
  ],
  [
    Wifi,
    "WiFi Installations & Repairs",
    "Router setup, mesh WiFi, optimisation and troubleshooting for reliable home and office connectivity.",
  ],
  [
    Wifi,
    "WiFi Dead-Zone Boosters",
    "Extend coverage into weak-signal areas with properly planned extenders and booster systems.",
  ],
  [
    Camera,
    "CCTV Installations, Repairs & Sales",
    "Security cameras, DVR/NVR installations, remote viewing and ongoing maintenance.",
  ],
  [
    Network,
    "Network Data Cabling",
    "Structured cabling for homes, offices, schools, retail spaces and businesses.",
  ],
  [
    Speaker,
    "Multi-Room Audio & AV",
    "Professional TV mounting, audio/video installations and multi-room entertainment systems.",
  ],
];

const gallery = [
  "gallery/black-rabbit-01.webp",
  "gallery/black-rabbit-02.webp",
  "gallery/black-rabbit-03.webp",
  "gallery/black-rabbit-04.webp",
  "gallery/black-rabbit-05.webp",
  "gallery/black-rabbit-06.webp",
  "gallery/black-rabbit-07.webp",
  "gallery/black-rabbit-08.webp",
  "gallery/black-rabbit-09.webp",
  "gallery/black-rabbit-10.webp",
  "gallery/black-rabbit-11.webp",
];

const Icon = ({
  icon: IconComponent,
  size = 22,
  strokeWidth = 2,
  ...props
}) => (
  <IconComponent
    size={size}
    strokeWidth={strokeWidth}
    aria-hidden="true"
    {...props}
  />
);

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState("");
  const [activeGallery, setActiveGallery] = useState(null);
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setSending(true);
    setStatus("");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to send your message.");
      }

      e.currentTarget.reset();
      setStatus("success");
    } catch (err) {
      setStatus(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  const closeMobileMenu = () => setMenu(false);

  const openGallery = (index) => {
    setActiveGallery(index);
  };

  const closeGallery = () => {
    setActiveGallery(null);
  };

  const showPreviousGallery = () => {
    setActiveGallery((current) =>
      current === null
        ? null
        : (current - 1 + gallery.length) % gallery.length
    );
  };

  const showNextGallery = () => {
    setActiveGallery((current) =>
      current === null
        ? null
        : (current + 1) % gallery.length
    );
  };

  useEffect(() => {
    if (activeGallery === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showPreviousGallery();
      if (event.key === "ArrowRight") showNextGallery();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeGallery]);

  return (
    <>
      <main>

        {/* =========================
            HERO
        ========================== */}
        <section
          id="hero"
          className="hero section dark-background"
        >
          <img
            src="/assets/img/hero-bg.jpg"
            className="hero-bg"
            alt=""
          />

          <div className="hero-overlay"></div>

          <div className="container position-relative">

            <div className="hero-copy text-center">

              <span className="eyebrow">
                CONNECTED. SECURE. ENTERTAINED.
              </span>

              <h1>
                Smart technology solutions for your{" "}
                <span>home & business.</span>
              </h1>

              <p>
                Professional DSTV, WiFi, CCTV, networking and
                audio-visual installations across Johannesburg
                and surrounding areas.
              </p>

              <div className="hero-actions">

                <a
                  href="#contact"
                  className="btn-primary-custom"
                >
                  Request a Quote
                  <ArrowRight size={18} />
                </a>

                <a
                  href="tel:+27836882899"
                  className="btn-outline-custom"
                >
                  <Phone size={18} />
                  Call Us
                </a>

              </div>

              {/* MultiChoice Accreditation */}
              <div
                className="accreditation-badge"
                aria-label="MultiChoice Accredited Installer"
              >
                <BadgeCheck size={29} />

                <div>
                  <strong>
                    MultiChoice Accredited Installer
                  </strong>

                  <span>
                    Professional DStv installation & support
                  </span>
                </div>
              </div>

            </div>

            {/* Hero Services */}
            <div className="hero-services row gy-3 justify-content-center">

              {services.slice(0, 5).map(
                ([IconComponent, title]) => (
                  <a
                    className="hero-service col-xl-2 col-md-4 col-6"
                    href="#services"
                    key={title}
                  >
                    <Icon
                      icon={IconComponent}
                      size={30}
                    />

                    <strong>{title}</strong>
                  </a>
                )
              )}

            </div>

          </div>
        </section>

        {/* =========================
            ABOUT
        ========================== */}
        <section id="about" className="about section">
          <div className="container">

            <div className="row gy-5 align-items-center">

              <div className="col-lg-6">
                <div className="image-frame">
                  <img
                    src="/assets/img/about.jpg"
                    className="img-fluid"
                    alt="Black Rabbit Aerials installation work"
                  />
                </div>
              </div>

              <div className="col-lg-6 content">

                <span className="section-kicker">
                  ABOUT BLACK RABBIT
                </span>

                <h2>
                  Technology installed properly,
                  with people in mind.
                </h2>

                <p>
                  Black Rabbit Aerials is a South African
                  technology and installation company based
                  in Ferndale, Randburg. We deliver reliable
                  connectivity, entertainment and security
                  solutions for residential and commercial
                  clients.
                </p>

                <p>
                  From a single TV mounting job to a complete
                  CCTV, WiFi and network installation, we focus
                  on clean workmanship, dependable equipment
                  and solutions that fit the way you actually
                  use your property.
                </p>

                <div className="check-grid">

                  {[
                    "Professional technicians",
                    "Quality equipment",
                    "Affordable pricing",
                    "Fast, reliable service",
                    "Residential & commercial",
                    "Tailored solutions",
                  ].map((item) => (
                    <div key={item}>
                      <CheckCircle size={17} />
                      {item}
                    </div>
                  ))}

                </div>

                <a
                  href="#services"
                  className="text-link"
                >
                  Explore our services
                  <ArrowRight size={17} />
                </a>

              </div>
            </div>

          </div>
        </section>

        {/* =========================
            SERVICES
        ========================== */}
        <section
          id="services"
          className="services section light-section"
        >
          <div className="container">

            <div className="section-title">

              <span className="section-kicker">
                WHAT WE DO
              </span>

              <p>
                Services built around your needs
              </p>

              <span>
                One team for connectivity, security
                and home entertainment.
              </span>

            </div>

            <div className="row gy-4">

              {services.map(
                ([IconComponent, title, description]) => (
                  <div
                    className="col-lg-4 col-md-6"
                    key={title}
                  >

                    <div className="service-card">

                      <div className="service-icon">
                        <Icon
                          icon={IconComponent}
                          size={27}
                        />
                      </div>

                      <h3>{title}</h3>

                      <p>{description}</p>

                      <a href="#contact">
                        Request service
                        <ArrowUpRight size={16} />
                      </a>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        </section>

        {/* =========================
            WHY BLACK RABBIT
        ========================== */}
        <section className="features section">

          <div className="container">

            <div className="row align-items-center gy-5">

              <div className="col-lg-6">

                <img
                  src="/assets/img/features-bg.jpg"
                  className="img-fluid rounded-4"
                  alt="Black Rabbit technology solutions"
                />

              </div>

              <div className="col-lg-6">

                <span className="section-kicker">
                  WHY BLACK RABBIT
                </span>

                <h2>
                  Reliable solutions without
                  the technical headache.
                </h2>

                <div className="feature-list">

                  {[
                    [
                      UserCheck,
                      "Professional technicians",
                      "Skilled installation and repair with attention to detail.",
                    ],
                    [
                      Cpu,
                      "Trusted equipment",
                      "Reliable products selected for long-term performance.",
                    ],
                    [
                      Zap,
                      "Fast response",
                      "We understand how disruptive connectivity and security problems can be.",
                    ],
                    [
                      House,
                      "Home & business",
                      "Solutions designed for homes, offices, retail, schools and other properties.",
                    ],
                  ].map(
                    ([IconComponent, title, description]) => (
                      <div
                        className="feature-row"
                        key={title}
                      >

                        <Icon
                          icon={IconComponent}
                          size={22}
                        />

                        <div>
                          <h4>{title}</h4>
                          <p>{description}</p>
                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            GALLERY
        ========================== */}
        <section
          id="portfolio"
          className="portfolio section light-section"
        >
          <div className="container">

            <div className="section-title">

              <span className="section-kicker">
                OUR WORK
              </span>

              <p>Work gallery</p>

              <span>
                A look at the type of work we deliver.
              </span>

            </div>

            <div className="gallery-grid">

              {gallery.map((src, index) => (

                <button
                  type="button"
                  className="gallery-item"
                  key={src}
                  onClick={() => openGallery(index)}
                  aria-label={`Open Black Rabbit project ${index + 1}`}
                >

                  <img
                    src={`/assets/img/${src}`}
                    alt={`Black Rabbit project ${index + 1}`}
                    loading="lazy"
                  />

                  <span>
                    <Plus size={30} />
                  </span>

                </button>

              ))}

            </div>

          </div>
        </section>

        {activeGallery !== null && (
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Black Rabbit project gallery"
            onClick={closeGallery}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={closeGallery}
              aria-label="Close gallery"
            >
              <X size={30} />
            </button>

            <button
              type="button"
              className="gallery-lightbox-nav gallery-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousGallery();
              }}
              aria-label="Previous photo"
            >
              <ArrowRight size={30} />
            </button>

            <div
              className="gallery-lightbox-content"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={`/assets/img/${gallery[activeGallery]}`}
                alt={`Black Rabbit project ${activeGallery + 1}`}
              />

              <div className="gallery-lightbox-counter">
                {activeGallery + 1} / {gallery.length}
              </div>
            </div>

            <button
              type="button"
              className="gallery-lightbox-nav gallery-lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                showNextGallery();
              }}
              aria-label="Next photo"
            >
              <ArrowRight size={30} />
            </button>
          </div>
        )}

        {/* =========================
            CTA
        ========================== */}
        <section className="cta-band">

          <div className="container d-lg-flex align-items-center justify-content-between">

            <div>

              <span className="section-kicker">
                NEED A SOLUTION?
              </span>

              <h2>
                Let's get your property connected.
              </h2>

              <p>
              <span className="section-kicker">

                Tell us what you need and we'll help you find the right setup.
                </span>
              </p>

            </div>

            <a
              href="#contact"
              className="btn-primary-custom"
            >
              Get a Free Quote
              <ArrowRight size={18} />
            </a>

          </div>

        </section>

        {/* =========================
            CONTACT
        ========================== */}
        <section
          id="contact"
          className="contact section"
        >

          <div className="container">

            <div className="section-title">

              <span className="section-kicker">
                CONTACT
              </span>

              <p>
                Let's talk about your project
              </p>

              <span>
              Send us your requirements and we'll
              get back to you.
              </span>

            </div>

            <div className="row gy-5">

              {/* Contact Information */}
              <div className="col-lg-5">

                <div className="contact-card">

                  <div className="contact-item">

                    <MapPin />

                    <div>
                      <small>VISIT US</small>
                      <h4>418 Cork Avenue</h4>
                      <p>Ferndale, Randburg</p>
                    </div>

                  </div>

                  <div className="contact-item">

                    <Phone />

                    <div>
                      <small>CALL US</small>

                      <h4>
                        <a href="tel:+27836882899">
                          083 688 2899
                        </a>
                      </h4>

                      <p>Available for enquiries</p>
                    </div>

                  </div>

                  <div className="contact-item">

                    <Mail />

                    <div>
                      <small>EMAIL US</small>

                      <h4>
                        <a href="mailto:info@blackrabbitaerials.co.za">
                          info@blackrabbitaerials.co.za
                        </a>
                      </h4>

                      <p>
                        We respond as soon as possible
                      </p>
                    </div>

                  </div>

                  <div className="map-wrap">

                    <iframe
                      title="Black Rabbit Aerials location"
                      loading="lazy"
                      src="https://www.google.com/maps?q=418%20Cork%20Avenue%20Ferndale%20Randburg&output=embed"
                    />

                  </div>

                </div>

              </div>

              {/* Contact Form */}
              <div className="col-lg-7">

                <form
                  className="contact-form"
                  onSubmit={submit}
                >

                  <div className="row gy-3">

                    <div className="col-md-6">

                      <label htmlFor="name">
                        Your Name *
                      </label>

                      <input
                        id="name"
                        name="name"
                        required
                        placeholder="John Smith"
                      />

                    </div>

                    <div className="col-md-6">

                      <label htmlFor="email">
                        Email Address *
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                      />

                    </div>

                    <div className="col-md-6">

                      <label htmlFor="phone">
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        placeholder="+27 ..."
                      />

                    </div>

                    <div className="col-md-6">

                      <label htmlFor="service">
                        Service
                      </label>

                      <select
                        id="service"
                        name="service"
                        defaultValue=""
                      >

                        <option
                          value=""
                          disabled
                        >
                          Select a service
                        </option>

                        {services.map(
                          ([, serviceName]) => (
                            <option
                              key={serviceName}
                              value={serviceName}
                            >
                              {serviceName}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="col-12">

                      <label htmlFor="subject">
                        Subject
                      </label>

                      <input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                      />

                    </div>

                    <div className="col-12">

                      <label htmlFor="message">
                        Message *
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="6"
                        placeholder="Tell us what you need..."
                      />

                    </div>

                    <div className="col-12 d-flex align-items-center gap-3 flex-wrap">

                      <button
                        className="btn-primary-custom border-0"
                        disabled={sending}
                        type="submit"
                      >

                        {sending
                          ? "Sending..."
                          : "Send Enquiry"}

                        <Send size={17} />

                      </button>

                      {status === "success" && (
                        <span className="form-success">
                          <CheckCircle size={16} />
                          Message sent. Check your email
                          for confirmation.
                        </span>
                      )}

                      {status &&
                        status !== "success" && (
                          <span className="form-error">
                            {status}
                          </span>
                        )}

                    </div>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* Back to Top */}
      <a
        href="#hero"
        className="scroll-top-custom"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </a>

      {/* Floating Mobile Contact Actions */}
      <div className="floating-contact-actions">
        <a
          href="https://api.whatsapp.com/send/?phone=27836882899&text=Hi+I+have+a+query%2C+please+help"
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="floating-whatsapp-icon"
          >
            <path
              fill="currentColor"
              d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.09.55 4.13 1.59 5.94L.13 24l6.36-1.67a11.8 11.8 0 0 0 5.59 1.41h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.42ZM12.09 21.8h-.01a9.94 9.94 0 0 1-5.07-1.39l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.92 9.92 0 1 1 8.43 4.66Zm5.45-7.44c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.95-2.28-.25-.6-.5-.52-.69-.53h-.59c-.2 0-.53.08-.81.38-.28.3-1.06 1.03-1.06 2.51s1.08 2.91 1.23 3.11c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z"
            />
          </svg>
        </a>

        <a
          href="#contact"
          className="floating-quote"
          aria-label="Get a quote"
        >
          <MessageCircle size={18} />
          <span>Quote</span>
        </a>
      </div>
    </>
  );
}