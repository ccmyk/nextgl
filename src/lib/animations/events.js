
export function addEvents () {

  this.main.events = {
    startscroll: new Event('startscroll'),
    stopscroll: new Event('stopscroll'),
    scrollto : new Event('scrollto',
    { bubbles: true, detail: { id: '' }}),

    // animshow : new CustomEvent('animshow',
    // {
    //   detail: 
    //   { el: '',
    //     param: 0 
    //   }
    // }),
    // animhide : new CustomEvent('animhide',
    // {  
    //     detail: 
    //     { el: '',
    //       param: 0 
    //     }
    // }),
    // animcreate : new CustomEvent('animcreate',
    // {  
    //     detail: 
    //     { el: '',
    //       param: 0 
    //     }
    // }),
    anim:new CustomEvent('anim',
    {
      detail: 
      { el: '',
        state:0,
        style:0,
        params: [0] 
      }
    }),
    nextprj:new CustomEvent('nextprj',
    {
      detail: 
      { el: '',
        url: '' 
      }
    }),
    newlinks : new Event('newlinks'),
    openmenu : new Event('openmenu'),
    closemenu : new Event('closemenu'),
  }

  document.addEventListener('startscroll',(e)=>{
    this.controlScroll(1)
  })
  document.addEventListener('stopscroll',(e)=>{
    this.controlScroll(0)
  })
  document.addEventListener('newlinks',(e)=>{
    
    this.addLinks()
  })
  document.addEventListener('scrollto',(e)=>{
    
    this.lenis.scrollTo('#'+e.target.dataset.goto,{offset:-100})
  })
  document.addEventListener('openmenu',(e)=>{
    this.controlScroll(0)
  })
  document.addEventListener('closemenu',(e)=>{
    this.controlScroll(1)
  })
  document.addEventListener('nextprj',async (e)=>{
   

    this.lenis.stop()
    this.lenis.scrollTo(this.page.DOM.el.querySelector('.project_nxt'),{duration:.3,force:true})
    await window.waiter(300)

      this.onChange({
      url:e.detail.url,
      link:e.detail.el
    })
    
    

  })


  document.addEventListener('anim',async (e)=>{
   
    if(e.detail.style == 0){
      if(e.detail.el.classList.contains('nono')){
        return false
      }
      this.writeFn( e.detail.el, e.detail.state)
      
    
    }
    else if(e.detail.style == 1){
      this.lenis.scrollTo(0)
      await window.waiter(600)
      this.controlScroll(0)
      Promise.all([
      this.gl.changeSlides(e.detail.state)
      ]).then(()=>{
        this.controlScroll(1)
      })

      
    }
    

  })

  document.addEventListener('visibilitychange',(e) =>{
    if (this.isload == 1) { 
      return false 
    }
    if(document.visibilityState=='hidden'){
      this.lenis.stop()
      window.cancelAnimationFrame(this.upid)
    }
    else{
      this.lenis.start()
      this.update(performance.now())
    }
  })

  window.addEventListener('popstate', (e)=>this.onPopState(e), { passive: true })
  window.onresize = ()=>{

    clearTimeout(this.res)
    this.res = setTimeout(this.onResize, 400)
  }


  // window.addEventListener('mousedown', this.onTouchDown, { passive: true })
  // window.addEventListener('mousemove', this.onTouchMove, { passive: true })
  // window.addEventListener('mouseup', this.onTouchUp, { passive: true })

  // window.addEventListener('touchstart', this.onTouchDown, { passive: true })
  // window.addEventListener('touchmove', this.onTouchMove, { passive: true })
  // window.addEventListener('touchend', this.onTouchUp, { passive: true })

  

  if(this.main.isTouch){
    window.addEventListener("orientationchange", function(event) {
      location.reload()
    })

    // window.addEventListener('scroll', this.onScroll, { passive: true })
  }
}



  // EVENTS

  // export function onContextMenu (event) {
  //   event.preventDefault()
  //   event.stopPropagation()

  //   return false
  // }


  export function onResize () {
    
    
    this.main.design.L.total = ( ( this.main.design.L.w / window.innerWidth ) * 10 )
    this.main.design.L.total = 10 - ((10 - this.main.design.L.total) * this.main.design.L.multi)
    this.main.design.L.total = Math.min(10,this.main.design.L.total)

    //MULTI PARA EL WIDE
    // this.main.design.L.wide = ((window.innerHeight*10)/window.innerWidth).toFixed(2)
    // this.main.design.L.total *=  Math.min(1,(this.main.design.L.wide/this.main.design.L.ratio)*1.05)
    


    this.main.design.P.total = ( ( this.main.design.P.w / window.innerWidth ) * 10 )
    this.main.design.P.total = 10 - ((10 - this.main.design.P.total) * this.main.design.P.multi)
    this.main.design.P.total = Math.min(10,this.main.design.P.total)



    document.documentElement.style.setProperty("--ck_multiL", this.main.design.L.total)
    document.documentElement.style.setProperty("--ck_multiP", this.main.design.P.total)

    if (this.main.isTouch){
      document.documentElement.style.setProperty("--ck_hscr", window.screen.height+'px')
      document.documentElement.style.setProperty("--ck_hmin", document.documentElement.clientHeight+'px')
      gsap.to(document.documentElement,{"--ck_hvar":window.innerHeight+"px",duration:.4})
      var isTouch = /Android|iPhone|iPad|iPod|Bla--ckBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
      if(!isTouch){
        location.reload()
      }
    
    }
    else{
    document.documentElement.style.setProperty("--ck_hscr", window.innerHeight+'px')
    document.documentElement.style.setProperty("--ck_hvar", window.innerHeight+'px')
    document.documentElement.style.setProperty("--ck_hmin", window.innerHeight+'px')
    var isTouch = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
    
    if(isTouch){
      location.reload()
    }

  }

    this.main.screen.w = window.innerWidth
    this.main.screen.h = window.innerHeight
    if (this.gl && this.gl.onResize) {
      this.gl.main.screen.w = window.innerWidth
      this.gl.main.screen.h = window.innerHeight
      this.gl.onResize()
    }
    if (this.page) {
      this.page.main.screen.w = window.innerWidth
      this.page.main.screen.h = window.innerHeight
      this.page.onResize()
    }

    if(this.mouse){
      this.mouse.main.screen.w = window.innerWidth
      this.mouse.main.screen.h = window.innerHeight

    }

    if(this.nav){
      this.nav.main.screen.w = window.innerWidth
      this.nav.main.screen.h = window.innerHeight
      this.nav.onResize()

    }

      
  }

  // export function onTouchDown (event) {
  //   event.stopPropagation()
  //   if (this.main.isTouch) return
  //   this.isclick = 1
  //   setTimeout(()=>{
  //     this.isclick = 0
  //   },12)
  //   // this.mouse.position.x = event.touches ? event.touches[0].clientX : event.clientX
  //   // this.mouse.position.y = event.touches ? event.touches[0].clientY : event.clientY
    
  //   // if (event.target.tagName === 'A') return

  //   // this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
  //   // this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

  //   if (this.page && this.page.onTouchDown) {
  //     this.page.onTouchDown(event)
  //   }

  // }

  // export function onTouchMove (event) {
  //   event.stopPropagation()
    
  //   if (this.main.isTouch) return
  //   if (!this.mouse) return
    
  //   this.mouse.position.x = event.touches ? event.touches[0].clientX : event.clientX
  //   this.mouse.position.y = event.touches ? event.touches[0].clientY : event.clientY


    

  //   if (this.page && this.page.onTouchMove) {
  //     this.page.onTouchMove(event)
  //   }

  // }

  // export function onTouchUp (event) {
  //   event.stopPropagation()
    
  //   if (this.main.isTouch) return


  //   if (this.page && this.page.onTouchUp) {
  //     this.page.onTouchUp(event)
  //   }

  // }

  //Scroll móvil
  // export function onScroll (event) {
    

  // }

  // export function onWheel (event) {

    
  // }


  // export function startWheel(ev){
  //   this.wheeling = 1
    
    
  //   this.pHide.style.pointerEvents='all'
  //   document.documentElement.classList.add('scroll-is')
    
  // }

  // export function stopWheel(){
  //   this.wheeling = 0
  //   this.speed = 0
  //   this.pHide.style.pointerEvents='none'
  //   document.documentElement.classList.remove('scroll-is')
   
  // }

  // export function onInteract () {
  //   window.removeEventListener('mousemove', this.onInteract)
  //   window.removeEventListener('touchstart', this.onInteract)
  //   this.update()
  // }

  // export function onKeyDown(event){
  //   if(document.querySelector('input:focus')){
  //     return false
  //   }
  //   // if(event.keyCode==40){
  //   //   this.speed += 20

  //   // }
  //   // else if(event.keyCode==38){
  //   //   this.speed -= 20

  //   // }
   
  // }
