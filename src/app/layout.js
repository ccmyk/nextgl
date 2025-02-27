// src/app/layout.js
import "@app/styles/globals.pcss";
import WebGLCanvas from "@/components/WebGLCanvas";
import Navigation from "@/components/NavComponent";
import { fetchSiteSettings } from "@/lib/startup/fetchSiteSettings";
// import Footer from "@/components/FooterComponent";
// import "@/lib/startup/constructor";

export const metadata = {
  title: "Chris Hall Selected Work",
  // description: "A Next.js 15-powered WebGL experience",
};

export default async function RootLayout({ children }) {
  const settings = await fetchSiteSettings();

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