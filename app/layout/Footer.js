const footerServices = [
  "DSTV Installations, Repairs & Sales",
  "WiFi Installations & Repairs",
  "WiFi Dead-Zone Boosters",
  "CCTV Installations, Repairs & Sales",
];

export default function Footer() {
  return (
    <footer className="footer dark-background">
      <div className="container">
        <div className="footer-main">
          <div>
            <img
              src="/assets/img/logo.png"
              className="footer-logo"
              alt="Black Rabbit Aerials"
            />
            <p>
              Professional connectivity, security and
              audio-visual solutions for homes and businesses.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Our Work</a>
            <a href="#contact">Contact</a>
          </div>

          <div>
            <h4>Services</h4>
            {footerServices.map((service) => (
              <a href="#services" key={service}>
                {service}
              </a>
            ))}
          </div>

          <div>
            <h4>Contact</h4>
            <p>
              418 Cork Avenue
              <br />
              Ferndale, Randburg
            </p>
            <a href="tel:+27836882899">083 688 2899</a>
            <a href="mailto:info@blackrabbitaerials.co.za">
              info@blackrabbitaerials.co.za
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026{" "}
          <a
            href="https://www.manxmedia.co.za"
            target="_blank"
            rel="noreferrer"
          >
            Manx Media (Pty) Ltd.
          </a>{" "}
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
