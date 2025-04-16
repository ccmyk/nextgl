// src/lib/ios/iO.js

import lazyVideo from '@/ios/lazyVideo'
import lazyImg from '@/ios/lazyImg'
import { iOpage } from './iOpage'

export function iO(page, index, anim) {
  if (anim.dataset.io) return false

  anim.dataset.io = index
  let animobj = {
    el: anim,
    pos: index,
    active: false,
  }

  const dispatchAnim = (state, el) => {
    page.main?.events?.anim.detail.state = state
    page.main?.events?.anim.detail.el = el
    document.dispatchEvent(page.main?.events?.anim)
  }

  if (anim.classList.contains('iO-lazyV')) {
    animobj.class = new lazyVideo(animobj, page.main?.isTouch, page.main?.vidauto, page.main?.events?.anim)
  } else if (anim.classList.contains('iO-lazyI')) {
    animobj.class = new lazyImg(animobj, page.main?.device, page.main?.isTouch)
  } else {
    if (anim.classList.contains('iO-std')) {
      dispatchAnim(0, anim.parentNode)

      if (['A', 'BUTTON'].includes(anim.parentNode.tagName)) {
        anim.parentNode.onmouseenter = () => dispatchAnim(1, anim.parentNode)
      }
    }

    animobj = iOpage(animobj)
  }

  if (animobj.class && animobj.class.prior === undefined) {
    animobj.class.prior = 10
  }

  return animobj
}