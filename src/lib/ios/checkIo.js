// src/lib/ios/checkIo.js

export function checkIo(main, pos, entry) {
  const target = main.ios[pos]
  if (!target?.class?.check) return false

  const isVisible = target.class.check(entry, main.scroll?.current)
  const updateType = target.class.isupdate

  if (!updateType) return false

  const pushIfMissing = (arr) => {
    if (!arr.includes(pos)) arr.push(pos)
  }
  const removeIfPresent = (arr) => {
    const idx = arr.indexOf(pos)
    if (idx !== -1) arr.splice(idx, 1)
  }

  if (isVisible) {
    if (updateType === 1) pushIfMissing(main.iosupdaters)
    else if (updateType === 2) pushIfMissing(main.updaters)
    else main.observer?.unobserve?.(entry.target)
  } else {
    if (updateType === 1) removeIfPresent(main.iosupdaters)
    else if (updateType === 2) removeIfPresent(main.updaters)
  }
}