"use client";
"use client"'use client'

import '@/styles/index.css'           // keep your global/css imports
import { LenisProvider }      from '@/context/LenisContext'
import { WebGLProvider }      from '@/context/WebGLContext'
import { AppEventsProvider }  from '@/context/AppEventsContext'
import { AppProvider }        from '@/context/AppProvider'
import Nav                    from '@/components/interface/Nav'
import Mouse                  from '@/components/interface/Mouse'

export default function RootLayout({ children }) {
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