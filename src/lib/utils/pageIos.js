// src/lib/uitils/pageIos.js
"use client";

// import Write from '@/lib/utils/Write'

import lazyVideo from '@/lib/utils/lazyVideo'
import lazyImage from '@/lib/utils/lazyImage'
// import lightNav from '@/lib/utils/lightnav.js'

export function buildThresholdList(numSteps) {
  var thresholds = []

  for (var i=1.0; i<=numSteps; i++) {
    var ratio = i/numSteps
    thresholds.push(ratio)
  }

  thresholds.push(0)
  return thresholds
}
//* función que se lanza en el callback de un io, solo se lanza si el IO tiene una clase
export function checkIo(pos,entry){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  let check = false
  check = this.ios[pos].class.check(entry,this.scroll.current)
  if(!this.ios[pos].class.isupdate){
    return false
  }
  if(check == true){
    if(this.ios[pos].class.isupdate==1){
      let i = this.iosupdaters.indexOf(pos)
      
      if(i==-1){
        this.iosupdaters.push(pos)
      }
    }
    else if(this.ios[pos].class.isupdate==2){
      let i = this.updaters.indexOf(pos)
    
      if(i==-1){
        this.updaters.push(pos)

      }
    }
    else{
      this.observer.unobserve(entry.target)
      
    }
  }
  
  else{
    if(this.ios[pos].class.isupdate==1){
      let i = this.iosupdaters.indexOf(pos)
      if(i!=-1){
        this.iosupdaters.splice(i, 1)
      }
    }
    else if(this.ios[pos].class.isupdate==2){
      let i = this.updaters.indexOf(pos)
      if(i!=-1){
        this.updaters.splice(i, 1)
      }
    }
  }
}

export function callIos(){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{

        if(entry.target.dataset.no ||!entry.target.dataset.io || this.isVisible == 0){
          return false
        }
        
        const pos = entry.target.dataset.io
        if(this.ios[pos]){
          if(this.ios[pos].class){
            if(this.ios[pos].class.check){
              this.checkIo(pos,entry)
              
            }
          }
          else{
            if(entry.isIntersecting){
              this.inViewAddClass(entry)
            }
            else{
              entry.target.parentNode.classList.remove('inview')
              entry.target.parentNode.classList.remove('okF')
            }
            
          }
        }

      })
    }
    
    let root = null
    
    if(this.main.isTouch){
      // root = document.body
      this.optionsob = {
        root:root,
        threshold:[0,1]
      }
    }
    else{
      this.optionsob = {
        root:root,
        threshold:[0,1]
      }
    }

    this.observer = new IntersectionObserver(this.callback,this.optionsob)
    
    if(this.ios){
      this.ios.forEach((el)=>{
        if(el.class){

          if(el.class.noob==1){
            return false
          }
        }
        this.observer.observe(el.el)
      })
    }

}

export function createIos () {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    this.DOM.ios = this.DOM.el.querySelectorAll('.iO')
    if(this.DOM.ios){
      let animobj = ''
      for(let[index,anim] of this.DOM.ios.entries()){
        animobj = this.iO(index,anim)


        this.ios.push(animobj)
      }

    }
  }
    
  export async function newIos(fromel = null){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    let newios = null
    if(fromel == null){
      newios = document.body.querySelectorAll('.iO')
  
    }
    else{
      newios = fromel.querySelectorAll('.iO')
    }
  
    if(newios.length == 0){
      return false
    }
  
    newios = Array.prototype.slice.call(newios)
    let oldios = Array.prototype.slice.call(this.DOM.ios)

    for(let [i,a] of this.DOM.ios.entries()){
      let foundio = newios.find(element => element === a)
      
      if(foundio==undefined){
        let pos = a.dataset.io
        if(this.ios[pos]){
          if(this.ios[pos].class){
            if(this.ios[pos].class.isupdate==1){
              let i = this.iosupdaters.indexOf(pos)
              if(i!=-1){
                this.iosupdaters.splice(i, 1)
              }
            }
            else if(this.ios[pos].class.isupdate==2){
              let i = this.updaters.indexOf(pos)
              if(i!=-1){
                this.updaters.splice(i, 1)
              }
            }
          }
          
          this.observer.unobserve(a)
          
        }
      }
    }
    
    this.DOM.ios = newios
    
    let animobj = ''
    for(let[index,anim] of this.DOM.ios.entries()){
      if(anim.dataset.io==undefined){
        animobj = this.iO(this.ios.length,anim)
        this.ios.push(animobj)
      }
    }
    
    this.ios.forEach((el)=>{
      if(el.class){

        if(el.class.noob==1){
          return false
        }
      }
      this.observer.observe(el.el)
    })
  }
  
  export function iOpage(animobj){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    return animobj
  }
  
  export function iO(index,anim){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    anim.dataset.io = index
    let animobj = {
      el:anim,
      class:null
    }
    
    if(anim.classList.contains('Lvideo')){
      
      let animev = new CustomEvent('anim', {
        detail: {
          state: 0,
          el: null
        }
      })
      
      animobj.class = new lazyVideo({el:anim,pos:index},this.main.isTouch,this.main.vidauto,animev)
      return animobj
    }
    
    if(anim.classList.contains('Limg')){
      
      animobj.class = new lazyImage({el:anim,pos:index},this.main.device,this.main.isTouch)
      return animobj
    }
    
    if(anim.classList.contains('Lnav')){
      
      return animobj
    }
    
    if(anim.classList.contains('Lwrite')){
      
      return animobj
    }
    
    
    
    animobj = this.iOpage(animobj)
    
    return animobj
    
  }
  
  export function inViewAddClass(entry){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if(entry.isIntersecting){
      
      entry.target.parentNode.classList.add('inview')
      
      if(entry.target.parentNode.classList.contains('stview')){
        
        this.main.events.anim.detail.state = 1
        this.main.events.anim.detail.el = entry.target.parentNode
        document.dispatchEvent(this.main.events.anim)
        
      }
      
      if(entry.target.dataset.once){
        this.observer.unobserve(entry.target)
        entry.target.parentNode.classList.add('okF')
      }
      
    }
    
  }
  
  export function showIos(){
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if(this.DOM.el.querySelectorAll('.iO')){
      for(let a of this.DOM.el.querySelectorAll('.iO')){
        
        if(a.dataset.delay){
          a.dataset.no = 1
          
          let delay = a.dataset.delay
          
          let that = this
          setTimeout(function(){
            delete a.dataset.no
            
          }, delay)
        }
        
      }
    }
    
    if(this.DOM.el.querySelectorAll('.Awrite')){
      for(let a of this.DOM.el.querySelectorAll('.Awrite')){
        
        if(a.classList.contains('stview')){
          
          this.main.events.anim.detail.state = 0
          this.main.events.anim.detail.el = a
          document.dispatchEvent(this.main.events.anim)
          
        }

      }
    }
    
    if(this.DOM.el.querySelectorAll('.Awrite .iO')){
      for(let a of this.DOM.el.querySelectorAll('.Awrite .iO')){
        
        a.parentNode.classList.add('ivi')
        
      }
    }
    
    if(this.DOM.el.querySelectorAll('.Limg')){
      for(let a of this.DOM.el.querySelectorAll('.Limg')){
        
        a.parentNode.classList.add('ivi')
        
      }
    }
    
    if(this.DOM.el.querySelectorAll('.Lvideo')){
      for(let a of this.DOM.el.querySelectorAll('.Lvideo')){
        
        a.parentNode.classList.add('ivi')
        
      }
    }
}
