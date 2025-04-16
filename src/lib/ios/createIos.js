// src/lib/ios/createIos.js

import { iO } from './iOpage'

export function createIos(page) {
  if (!page?.DOM?.el) return

  const ios = page.DOM.el.querySelectorAll('.iO')
  page.DOM.ios = ios
  page.ios = []

  for (let [index, el] of ios.entries()) {
    const animobj = iO(index, el, page)
    page.ios.push(animobj)
  }
}