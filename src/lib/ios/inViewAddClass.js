// src/lib/ios/inViewAddClass.js

export function inViewAddClass(main, entry) {
  const el = entry.target?.parentNode
  if (!el) return

  el.classList.add('inview')
  if (!el.dataset.bucle && el.classList.contains('stview')) return

  el.classList.add('stview')

  if (entry.target.classList.contains('iO-std')) {
    main.events.anim.detail.state = 1
    main.events.anim.detail.el = el
    document.dispatchEvent(main.events.anim)

    if (el.dataset.bucle) {
      el.classList.add('okF')
    }
  }
}