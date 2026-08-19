import "./styles/globals.css";
import "./styles/home.css";
import "./styles/header.css";
import "./styles/footer.css";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

export const metadata = {
  title: "Black Rabbit Aerials | DSTV, WiFi, CCTV & Networking",
  description:
    "Professional DSTV, WiFi, CCTV, networking and audio-visual installation services in Johannesburg and surrounding areas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
