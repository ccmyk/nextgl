'use client'

import '@/styles/index.css'
import { LenisProvider }      from '@/context/LenisContext'
import { WebGLProvider }      from '@/context/WebGLContext'
import { AppEventsProvider }  from '@/context/AppEventsContext'
import { AppProvider }        from '@/context/AppProvider'
import { PageProvider } from '@/context/PageContext';
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
                <PageProvider>
                  <Nav html={navHtml} />
                  {/* only render the cursor on non-touch devices */}
                  {!('ontouchstart' in window) && <Mouse />}
                  {children}
                </PageProvider>
              </AppProvider>
            </AppEventsProvider>
          </WebGLProvider>
        </LenisProvider>
      </body>
    </html>
  )
}