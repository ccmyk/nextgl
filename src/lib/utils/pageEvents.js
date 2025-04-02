// src/lib/utils/pageEvents.js
"use client";

export function onResize () {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  
    for(let [index,key] of Object.keys(this.components).entries()){

      if(Array.isArray(this.components[key])){
        for(let comp of this.components[key]){
          if(comp.onResize){
            comp.onResize()
          }
        }
      }
      else{
        if(this.components[key].onResize){
          this.components[key].onResize()
        }
      }

    }

    for(let el of this.ios){
      if(el){
        if(el.class){
          if(el.class.onResize){
            el.class.onResize(this.scroll.target)
          }
        }
      }
    }
    
    this.resizeLimit()

}
export function resizeLimit(){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  
    let size = 0

    

    // size -=  window.innerHeight
      
    this.scroll.limit = this.DOM.el.clientHeight - this.main.screen.h
    
}

export function onScroll (scrollY){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  
    // this.scroll.target = document.body.scrollTop
  
}

export function onTouchDown (event) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  
    this.isDown = true
  
}

export function onTouchMove (event) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  
    if (!this.isDown) return
  
}

export function onTouchUp (event) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;

    this.isDown = false
}


export function onWheel (y) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  
    if(this.isVisible==0){
      return
    }
    // y = clamp(-60,60,y)
    // this.scroll.target += y

}
