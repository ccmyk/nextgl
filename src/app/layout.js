// src/app/layout.js
import "@/styles/globals.pcss";
import AppInitializer from "@/components/AppInitializer";
import WebGLApp from "@/components/WebGLApp";
import Navigation from "@/components/NavComponent";
// import Footer from "@/components/FooterComponent";
import { fetchSiteSettings } from "@/lib/startup/fetchSiteSettings";
import { AnimationProvider } from "@/contexts/AnimationContext";

export const metadata = {
  title: "Chris Hall Selected Work",
  description: "Interactive portfolio showcasing selected works",
};

export default async function RootLayout({ children }) {
  const settings = await fetchSiteSettings();

  return (
    <html lang="en">
      <body>
        <AppInitializer>
          <AnimationProvider>
            <WebGLApp>
              <Navigation />
              <main>{children}</main>
              {/* <Footer /> */}
            </WebGLApp>
          </AnimationProvider>
        </AppInitializer>
      </body>
    </html>
  );
}