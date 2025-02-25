

// import Selc from '/atoms🧿🧿🧿/Selc'
// import Chk from '/atoms🧿🧿🧿/Chk'
import Link from '/atoms🧿🧿🧿/Link'
import Title from '/atoms🧿🧿🧿/Title'


export async function create (content,main,temp=undefined) {



    this.ios = []
    this.iosupdaters = []
    this.updaters = []
    
    this.components = {

    }
    this.main=main
    
    if(this.main.isTouch){
      this.scroll = {
        target: 0,
        current:0,
        limit:0,
        last:0,
        down:1
      }
      
    }
    else{
      this.scroll = {
        target:0,
        last:0,
        limit:0,
        down:1
      }
    }
    

    
}

//* Función crear componentes
export async function createComps(){


  if(this.main.device > 1){
    if(this.DOM.el.querySelectorAll('.footer')){
      for(let a of this.DOM.el.querySelectorAll('.footer .Awrite .iO')){


        a.parentNode.classList.add('ivi')
        a.parentNode.classList.add('nono')
        a.parentNode.classList.add('stview')
        
        
        

    }
    }

  }


}


export  function cleanP(){
    if(this.DOM.el.querySelector('p:empty')){
      for(let p of this.DOM.el.querySelectorAll('p:empty')){
        p.remove()
      }
    }
}

export function cleanWysi(){
    for(let a of this.DOM.el.querySelectorAll('.wysi img')){
      a.removeAttribute('loading')
      let src = a.src
      a.dataset.src = src
      a.removeAttribute('src')
      a.removeAttribute('width')
      a.removeAttribute('height')

      let parent = a.parentNode
      // console.log(parent.tagName)
      if(parent.tagName=='P'){
        // parent.parent.replaceChild(a,parent)

        parent.parentNode.insertBefore(a, parent)
        parent.remove()

      }

    }
}