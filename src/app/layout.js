import "../globals.css"; // Global styles
import Nav from "@/components/Nav"; // Navigation bar
import Footer from "@/components/Footer"; // Optional footer
import "@/lib/startup/constructor"; // App-wide initialization

export const metadata = {
  title: "Chris Hall Selected Work",
  description: "A Next.js 15-powered WebGL experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}