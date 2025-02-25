export class Charset {
constructor(element, options = {}) {
    this.element = element
    this.options = options
    
    this.chars = []
    this.charw = []
    this.charh = []
    this.charsposw = []
    this.totalw = 0
    this.totalh = 0
    
    this.initialize()
}

initialize() {
    // Split text into characters using SplitType
    this.tt = new SplitType(this.element, {
    types: 'chars',
    ...this.options
    })
    
    this.chars = this.tt.chars
    this.calculateDimensions()
}

calculateDimensions() {
    this.totalw = 0
    this.charw = []
    this.charh = []
    this.charsposw = []
    
    this.chars.forEach((char, i) => {
    const rect = char.getBoundingClientRect()
    this.charw[i] = rect.width
    this.charh[i] = rect.height
    this.charsposw[i] = this.totalw
    this.totalw += rect.width
    
    if (rect.height > this.totalh) {
        this.totalh = rect.height
    }
    })
}

bindEvents(handlers) {
    this.chars.forEach((char, i) => {
    if (handlers.mouseenter) {
        char.addEventListener('mouseenter', () => handlers.mouseenter(i))
    }
    if (handlers.mouseleave) {
        char.addEventListener('mouseleave', () => handlers.mouseleave(i))
    }
    if (handlers.mousedown) {
        char.addEventListener('mousedown', () => handlers.mousedown(i))
    }
    if (handlers.mouseup) {
        char.addEventListener('mouseup', () => handlers.mouseup(i))
    }
    if (handlers.touchstart) {
        char.addEventListener('touchstart', () => handlers.touchstart(i), { passive: true })
    }
    if (handlers.touchend) {
        char.addEventListener('touchend', () => handlers.touchend(i))
    }
    })
}

getUniformArrays() {
    return {
    widths: new Float32Array(this.charw),
    heights: new Float32Array(this.charh),
    positions: new Float32Array(this.charsposw)
    }
}

reflow() {
    this.calculateDimensions()
    return this.getUniformArrays()
}

destroy() {
    if (this.tt) {
    this.tt.revert()
    }
}

get length() {
    return this.chars.length
}

get width() {
    return this.totalw
}

get height() {
    return this.totalh
}
}

