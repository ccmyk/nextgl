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


//* Se lanza en start ( que debería ir después del page.show ) y lo que hace es hacer los observers
export function callIos(){
    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{
        //Si la vista no está en visible, si el elemento no tiene pos o si tiene el dataset.no ( que lo endiña el delay )
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
        // threshold:this.buildThresholdList(500)
        // threshold:[0,.2,.4,.6,.8,1]
        // threshold: []
        threshold:[0,1]
      }
    }
    else{
      this.optionsob = {
        root:root,
        // threshold:this.buildThresholdList(500)
        // threshold:[0,.2,.4,.6,.8,1]
        // threshold: []
        threshold: [0,1]
      }
    }
    

    this.observer = new IntersectionObserver(this.callback,this.optionsob)

    // this.ios = this.DOM.el.querySelectorAll('.iO')
    
    if(this.ios){
      this.ios.forEach((el)=>{
        if(el.class){
          //el noob es por si no quieres que lo observe
          if(el.class.noob==1){
            return false
          }
        }
        this.observer.observe(el.el)
      })
    }

}


//* Hace la query de los ios, y lanza la fn iO, para seleccionar el tipo de iO
export function createIos () {
    this.DOM.ios = this.DOM.el.querySelectorAll('.iO')
    if(this.DOM.ios){
      let animobj = ''
      for(let[index,anim] of this.DOM.ios.entries()){
        animobj = this.iO(index,anim)


        this.ios.push(animobj)
      }
      //* El sort este, no sé si sirve
      // this.ios.sort((a, b) => {
      //   if(!a.class){
      //     return 1
      //   }
      //   if(a.class.prior == b.class.prior) {
      //     return 0; 
      //   }
      //   if(a.class.prior < b.class.prior) {
      //     return -1;
      //   }
      //   return 1;
      // })
    }
  }
  
  //* Para las cargas de Ajax que genera nuevos elementos, buscar los Ios nuevos y elimina los que ya no están
  
  export async function newIos(fromel = null){
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
        }
        this.observer.unobserve(a)
        delete this.ios[pos]



      }

    }

    this.ios = this.ios.filter(x => x !== undefined)
    //Se borran los antiguos que ya no existen y se limpia el array    


    //se buscan los nuevos
    for(let [i,a] of newios.entries()){
      let foundio = oldios.find(element => element === a)
      
      if(foundio==undefined){
        let newindex = this.ios.length
        let animobj = this.iO(newindex,a)
           
        this.ios.push(animobj)
        let last = this.ios.length-1
        if(this.ios[last].class){
          this.ios[last].class.onResize(this.scroll.current)
        
        }
        this.observer.observe(this.ios[last].el)
        
      }
    }

    this.DOM.ios = document.body.querySelectorAll('.iO')

  }

export  function iOpage(animobj){

    return animobj

}
//* Búsqueda de elementos Ios, lanza ioPage para buscar los específicos por page
export  function iO(index,anim){
    if(anim.dataset.io){
      return false
    }
      anim.dataset.io = index
    let animobj = {
      el: anim,
      pos: index,
      active: false
    }

    if(anim.classList.contains('iO-lazyV')){
      animobj.class = new lazyVideo(animobj,this.main.isTouch,this.main.vidauto,this.main.events.anim)
       
    }
    else if(anim.classList.contains('iO-lazyI')){
      animobj.class = new lazyImage(animobj,this.main.device,this.main.isTouch)
      
    }
    else{


      if(anim.classList.contains('iO-std')){

        this.main.events.anim.detail.state = 0
        this.main.events.anim.detail.el = anim.parentNode
        document.dispatchEvent(this.main.events.anim)


        if(anim.parentNode.tagName=='A' || anim.parentNode.tagName=='BUTTON'){

          anim.parentNode.onmouseenter = () =>{
            this.main.events.anim.detail.state = 1
            this.main.events.anim.detail.el = anim.parentNode
            document.dispatchEvent(this.main.events.anim)
          }

        }
      }


      animobj = this.iOpage(animobj)
    }

    if(animobj.class){
      if(animobj.class.prior==undefined){
        animobj.class.prior = 10
      }
      
    }
    return animobj

}

//* Mete clase y deja de observar ( se usa cuando no tiene ningún tipo )
export function inViewAddClass(entry){
    // if(entry.intersectionRatio > 0.6){

      entry.target.parentNode.classList.add('inview')
      if(!entry.target.parentNode.dataset.bucle && entry.target.parentNode.classList.contains('stview')){
        return false
      }
      entry.target.parentNode.classList.add('stview')
      if(entry.target.classList.contains('iO-std')){

        this.main.events.anim.detail.state = 1
        this.main.events.anim.detail.el = entry.target.parentNode
        
        document.dispatchEvent(this.main.events.anim)
        
        if(entry.target.parentNode.dataset.bucle){
          entry.target.parentNode.classList.add('okF')

          return false

        }
      }
      // this.observer.unobserve(entry.target)
    // }
}


 //* Para mostrar los ios,lanza el show por si en el create se tiene que poner una animación de los ios a 0
 //* y se respetan delays y demás
export  function showIos(){
    this.waitres = 0
    for(let a of this.ios){

      if(a.el.dataset.delay){
        a.el.dataset.no = 'true'
        a.el.style.display = 'none'
        setTimeout(()=>{

          a.el.removeAttribute('data-no')
          a.el.style.display = 'block'
          a.el.style.visibility = 'visible'

          if(a.class){
            if(a.class.create){
              a.class.create()
              a.class.isstarted = 1
            
            }
            if(a.class.check){
              let bound = a.el.getBoundingClientRect()
              let entry = {
                boundingClientRect:{
                  top:bound.top,
                  bottom:bound.bottom,
                  left:bound.left,
                  right:bound.right,
                  width:a.el.clientWidth,
                  height:a.el.clientHeight
                }
              }

              this.ios[a.el.dataset.io].class.onResize(this.scroll.current)
              
              this.ios[a.el.dataset.io].class.update(this.speed,this.scroll.current)
              
              this.checkIo(a.el.dataset.io,entry)

            }
          }
        },a.el.dataset.delay)
        
      }
      if(a.el.dataset.await){
        setTimeout(()=>{

          a.el.style.visibility = 'visible'
        },a.el.dataset.await)
        if(this.waitres < a.el.dataset.await){
          this.waitres = parseInt(a.el.dataset.await)
        }
      }
      else{
        a.el.style.visibility = 'visible'
        if(a.class){
          if(a.class.check){
            let bound = a.el.getBoundingClientRect()
            let entry = {
              boundingClientRect:{
                top:bound.top,
                bottom:bound.bottom,
                left:bound.left,
                right:bound.right,
                width:a.el.clientWidth,
                height:a.el.clientHeight
              }
            }

            this.ios[a.el.dataset.io].class.onResize(this.scroll.current)

            this.ios[a.el.dataset.io].class.update(this.speed,this.scroll.current)

            this.checkIo(a.el.dataset.io,entry)

          }
        }
      }

    }
    this.waitres +=24
}

//* Para animar los ios cuando se hace scroll
