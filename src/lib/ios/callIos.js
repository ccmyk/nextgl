// src/lib/ios/callIos.js

export function callIos(page) {
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      const el = entry.target
      const pos = el.dataset.io

      if (!pos || page.isVisible === 0) return

      const io = page.ios?.[pos]
      if (!io) return

      if (io.class?.check) {
        const visible = io.class.check(entry, page.scroll?.current)

        if (visible) {
          const list = io.class.isupdate === 1 ? page.iosupdaters : page.updaters
          if (!list.includes(pos)) list.push(pos)
        } else {
          const list = io.class.isupdate === 1 ? page.iosupdaters : page.updaters
          const idx = list.indexOf(pos)
          if (idx !== -1) list.splice(idx, 1)
        }
      } else {
        const parent = el.parentNode
        if (entry.isIntersecting) {
          parent.classList.add('inview')
        } else {
          parent.classList.remove('inview', 'okF')
        }
      }
    })
  }

  page.observer = new IntersectionObserver(observerCallback, {
    root: null,
    threshold: [0, 1]
  })

  page.ios?.forEach((io) => {
    if (!io?.class?.noob) {
      page.observer.observe(io.el)
    }
  })
}