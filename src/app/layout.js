'use client'

import '@/styles/index.css'
import { LenisProvider }      from '@/context/LenisContext'
import { WebGLProvider }      from '@/context/WebGLContext'
import { AppEventsProvider }  from '@/context/AppEventsContext'
import { AppProvider }        from '@/context/AppProvider'
import Nav                    from '@/components/interface/Nav'
import Mouse                  from '@/components/interface/Mouse'
import { usePageTransition }  from '@/hooks/usePageTransition';

export default function RootLayout({ children }) {
  usePageTransition();
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <WebGLProvider>
            <AppEventsProvider>
              <AppProvider>
                <Nav html={navHtml} />
                {/* only render the cursor on non-touch devices */}
                {!('ontouchstart' in window) && <Mouse />}
                {children}
              </AppProvider>
            </AppEventsProvider>
          </WebGLProvider>
        </LenisProvider>
      </body>
    </html>
  )
}