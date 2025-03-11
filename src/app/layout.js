// src/app/layout.js
import "@/styles/globals.css";
import AppInitializer from "@/components/AppInitializer";
import { WebGLProvider } from "@/components/gl/utils/SceneProvider";
import Nav from "@/components/Nav";
import { fetchSiteSettings } from "@/lib/startup/fetchSiteSettings";
import { montreal, montrealBook } from "@/app/fonts";

export const metadata = {
  title: "Chris Hall Selected Work",
  description: "Interactive portfolio showcasing selected works",
};

export default async function RootLayout({ children }) {
  // Fetch settings with error handling
  let settings;
  try {
    settings = await fetchSiteSettings();
  } catch (error) {
    console.error("Error in layout while fetching settings:", error);
    // Provide fallback settings
    settings = {
      title: "Next GL",
      description: "WebGL experiences with Next.js",
      theme: {
        colors: {
          primary: "#ffffff",
          secondary: "#050505",
        },
      },
      device: -1,
      webp: 1,
      webgl: 1,
    };
  }

  return (
    <html lang="en" className={`loading lenis ${montreal.variable} ${montrealBook.variable}`}>
      <body>
        <AppInitializer initialSettings={settings}>
          <WebGLProvider>
            <Nav />
            <main className="main-content">{children}</main>
          </WebGLProvider>
        </AppInitializer>
      </body>
    </html>
  );
}