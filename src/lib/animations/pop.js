

export function addPop () {

  //window.addEventListener('popstate', this.onPopState, { passive: true })
  
}



  // EVENTS

  // Patrás y palante
export function onPopState (e) {
  if(this.isload == 1){
    e.preventDefault()
    return false
  }
    this.onChange({
      url: window.location.pathname,
      link:null,
    })
}



  // Empieza el cambio
export async function onChange ({ url = null, link = null }) {
    url = url.replace(window.location.origin, '')
    if (this.isload == 1 || this.url === url) return
    this.lenis.stop()
    this.issame = 0
    this.page.isVisible = false
    this.isload = 1
    
    
    
    if(this.mouse){
      this.mouse.clean()
    }
    
    let time = 1200
    
    this.url = url

    let functowait = []
    // functowait.push()
    // await this.page.hide()
    
    document.body.style.pointerEvents = 'none'

    const request = await window.fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const response = await request.text()
    var push = true

    if(this.gl){
      this.gl.cleanTemp()
    }
    
    let checkout = await this.page.animOut(link,this.lenis)
    
    
    if(Array.isArray(checkout)){
      time = 0
      document.querySelector('body').insertAdjacentHTML('afterbegin','<div class="faketit c-vw nfo"></div>')
      let faketit = document.querySelector('.faketit')
      faketit.appendChild(checkout[0].cloneNode(true))
      faketit.appendChild(checkout[1].cloneNode(true))
      checkout[0].remove()
      checkout[1].remove()
    }

    await this.timeout(time)


	  Promise.all([
      this.onRequest({
        push,
        response,
        url
      })
    ]).then(()=>{
      this.newView()

    })

  }

  // llamada de la nueva URL
export async function onRequest ({ push, response, url }) {
    const html = document.createElement('div')

    html.innerHTML = response
    if(html.querySelector('title')){
      document.title = html.querySelector('title').textContent
    }
    this.content = html.querySelector('#content')
    

    if (push) {
      window.history.pushState({}, document.title, url)
    }

    await this.page.hide()
    this.lenis.scrollTo(0,{immediate:true,lock:true,force:true})
    this.page.DOM.el.remove()
    
    

    this.template = this.content.dataset.template
    this.newpage = this.pages.get(this.template)
    this.newpage.id = this.content.dataset.id

    this.newpage.ispop = 1
    await this.newpage.create(this.content,this.main,null)
    if(this.gl){
      await this.gl.createTemp(this.template)
    }
    
}


export async function newView(){
    
    
     
    // console.log('estoy aquí')
    // this.loader.hide()

    if(this.mouse){
      this.mouse.reset()
    }

    
    document.body.style.pointerEvents = ''
    this.isload = 0
    
    this.newpage.show(0)

    if(this.canvas){
      this.canvas.show()
    }

    this.page = this.newpage
    let state = this.page.start(0)
    if(this.gl){
      this.gl.show()
    }

    this.newpage.ispop = 0
    


    this.addControllers()
    this.lenis.start()

}


//CHECKS 
//1.Onchange
//2.Pops palante y patrás
////3.tener en cuenta menú abierto o modales
////4.tener en cuenta transiciones entre vistas del mismo tipo ( de post a post, por ejemplo )




export  function resetLinks(){
  const links = document.querySelectorAll('a')
  

  const actual = window.location.href
  for(let link of links){

    if(link.classList.contains('Awrite')){

      // link.onmouseenter = () => this.writeFn(link)


      // link.onmouseenter = () => {
      //   this.main.events.animglobal.detail.el = link
      //   document.dispatchEvent(this.main.events.animglobal)
       
      // }

      
    }

    let isLocal = link.href.indexOf(this.main.base) == 0
    const isAnchor = link.href.indexOf('#') > -1

    if(link.dataset.type && !isAnchor){
      if(import.meta.env.DEV){
        isLocal = true
        if(link.dataset.type){
          link.href = '/'+link.dataset.type+'.html'
        }
      }
      link.removeAttribute('data-type')
    }

   
    


    if (isLocal || isAnchor) {
      link.onclick = async(event) => {
        event.preventDefault()
        
        if (!isAnchor) {
          
          this.onChange({
            url: link.href,
            id: link.dataset.id,
            link:link
            
          })
        }
        else{
          
          if(this.nav.isOpen==1){
            this.nav.isOpen = 0
            this.nav.closeMenu()
            await this.timeout(450)



          }
          if(link.href.split('#').length == 2){
            this.lenis.scrollTo('#'+link.href.split('#')[1],{offset:-100})
          }

        }
      }
    } else if (link.href.indexOf('mailto') === -1 && link.href.indexOf('tel') === -1) {
      link.rel = 'noopener'
      link.target = '_blank'
    }
    //CLEAN CLASS
    if(actual==link.href){
      link.classList.add('actLink')
      
    }
    else{
      link.classList.remove('actLink')
    }
  }
}
