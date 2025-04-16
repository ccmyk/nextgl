// src/lib/ios/newIos.js

export function newIos(main) {
  const { DOM, ios, observer, iosupdaters, updaters, scroll } = main

  let newElements = Array.from(DOM.el?.querySelectorAll('.iO') || [])
  let oldElements = Array.from(DOM.ios || [])

  // Remove elements no longer present
  oldElements.forEach((oldEl) => {
    if (!newElements.includes(oldEl)) {
      const pos = oldEl.dataset.io
      if (ios[pos]?.class) {
        const ioClass = ios[pos].class
        if (ioClass.isupdate === 1) {
          const i = iosupdaters.indexOf(pos)
          if (i !== -1) iosupdaters.splice(i, 1)
        } else if (ioClass.isupdate === 2) {
          const i = updaters.indexOf(pos)
          if (i !== -1) updaters.splice(i, 1)
        }
      }
      observer?.unobserve?.(oldEl)
      delete ios[oldEl.dataset.io]
    }
  })

  // Add new elements
  newElements.forEach((newEl) => {
    if (!oldElements.includes(newEl)) {
      const index = ios.length
      const animobj = main.iO(index, newEl)
      ios.push(animobj)

      if (animobj?.class?.onResize) {
        animobj.class.onResize(scroll?.current)
      }

      observer?.observe?.(animobj.el)
    }
  })

  // Replace the DOM reference
  DOM.ios = newElements
}