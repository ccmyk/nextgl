// ── src/app/layout.jsx ──         // any base resets or @import’d CSS
import '@/styles/index.pcss';           // your legacy index.css split into modules?

import { LenisProvider }      from '@/context/LenisContext';
import { WebGLProvider }      from '@/context/WebGLContext';
import { AppEventsProvider }  from '@/context/AppEventsContext';
import { AppProvider }        from '@/context/AppProvider';

import Loader     from '@/components/interface/Loader';
import Nav        from '@/components/interface/Nav';
import Mouse      from '@/components/interface/Mouse';
import PageTransition from '@/components/interface/PageTransition';

export const metadata = {
  title: 'Chris Hall',
  description: '…',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="D">
      <body>
        {/* 1) Bootstrapping contexts in order: AppProvider → AppEvents → Lenis → WebGL */}
        <AppProvider>
          <AppEventsProvider>
            <LenisProvider>
              <WebGLProvider>

                {/* 2) Global UI: transitions, loaders, nav, cursor */}
                <PageTransition />
                <Loader />
                <Nav logo="Chris Hall" links={[
                  { href: '/', label: 'Home' },
                  { href: '/work', label: 'Work' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                ]} /> 
                <Mouse />

                {/* 3) Your page’s content (Home, Projects, etc.) */}
                {children}

              </WebGLProvider>
            </LenisProvider>
          </AppEventsProvider>
        </AppProvider>
      </body>
    </html>
  );
}