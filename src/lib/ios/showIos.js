// src/lib/ios/showIos.js

export function showIos(page) {
  page.waitres = 0

  page.ios?.forEach(io => {
    const el = io.el
    const delay = el.dataset.delay
    const awaitTime = el.dataset.await

    if (delay) {
      el.dataset.no = 'true'
      el.style.display = 'none'

      setTimeout(() => {
        el.removeAttribute('data-no')
        el.style.display = 'block'
        el.style.visibility = 'visible'

        io.class?.create?.()
        io.class.isstarted = 1

        const bound = el.getBoundingClientRect()
        const entry = {
          boundingClientRect: bound
        }

        io.class?.onResize?.(page.scroll?.current)
        io.class?.update?.(page.speed, page.scroll?.current)

        page.checkIo?.(el.dataset.io, entry)
      }, parseInt(delay))
    }

    if (awaitTime) {
      setTimeout(() => {
        el.style.visibility = 'visible'
      }, parseInt(awaitTime))

      page.waitres = Math.max(page.waitres, parseInt(awaitTime))
    } else {
      el.style.visibility = 'visible'

      const bound = el.getBoundingClientRect()
      const entry = {
        boundingClientRect: bound
      }

      io.class?.onResize?.(page.scroll?.current)
      io.class?.update?.(page.speed, page.scroll?.current)

      page.checkIo?.(el.dataset.io, entry)
    }
  })

  page.waitres += 24
}