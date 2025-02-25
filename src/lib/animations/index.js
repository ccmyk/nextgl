import AutoBind from 'auto-bind'
import Lenis from '@studio-freight/lenis'
//Basic
import Nav from '/components🦾🦾🦾/Nav🌤️'
import Loader from '/components🦾🦾🦾/Loader⏳'

import gl from '/gl🌊🌊🌊/gl.js'

//Mouse
import Mouse from '/components🦾🦾🦾/Mouse🐭'


// import home from '/views👁️👁️👁️/⚪Home/home.js?url'
// import enterprise from '/views👁️👁️👁️/🔵Enterprise/enterprise.js?url'
// import ai from '/views👁️👁️👁️/🟢Ai/ai.js?url'
// import news from '/views👁️👁️👁️/📚News/news.js?url'

import {
  createViews


} from './👁️.js'

import {
  onPopState,
  onRequest,
  onChange,
  newView,
  resetLinks


} from './pop.js'

import {
  addEvents,
  // onTouchDown,
  // onTouchMove,
  // onTouchUp,
  // onKeyDown,
  // onWheel,
  // onScroll,
  onResize


} from './events.js'


import {
  writeFn,
  writeCt


} from './anims.js'


class App {
  constructor (info) {
   AutoBind(this)
    this.content = document.querySelector('#content')
    this.main = info[0]
    this.main.base = info[1].fields.base
    this.main.template = info[1].fields.template

    this.main.screen = {
      w:window.innerWidth,
      h:window.innerHeight
    }

    this.FR = 1e3 / 60

    this.speed = 0
    this.wheeling = 0
    this.isclick = 0
    this.searching = 0
    this.isload = 1
    this.scry = 0

    this.resizevar = ''
    this.url = window.location.pathname


    this.initApp(info[1],info[1].texs)
    
  }
  
  async initApp (temps,texs) {
    //Events
    this.addEvents()



    //Lenis
    this.lenis = new Lenis({
      wheelEventsTarget:document.documentElement,
      // lerp:.1,
      // lerp:.06,
      lerp:.04,
      duration:.8,
      smoothWheel:!this.main.isTouch,
      smoothTouch:false,
      normalizeWheel:true,
    })

    this.lenis.stop()

    if(this.main.isTouch == 0){
      this.createScrollBar()
    }


    this.createScrollCheck()
    //Loader
    let time = 1400
    if(import.meta.env.DEV == true){
      time = 1400
    }
    this.template = this.content.dataset.template
    
    this.loader = new Loader(this.main,temps.loader,this.main.device)
      
    await this.loader.create()
    
    this.loader.start()
    
    let firsttemp = undefined
    if(temps.main){
      firsttemp = temps.main
    }
    
    
    //PHIDE
    this.pHide = document.createElement('div')
    this.pHide.className = 'pHide'
    document.querySelector('body').appendChild(this.pHide)

    //Pages
    this.createViews()
    if(this.template.includes('lcl')){
      this.template = this.template.substring(0,this.template.length-3)
    }
    
    //Page
    this.page = this.pages.get(this.template)
    await this.page.create(this.content,this.main,firsttemp)
    
    //Nav
    this.nav = new Nav(this.main)
    this.nav.create(temps.nav)



    //Lets play
    
    this.update()

    await this.timeout(260)
    
    let funcgl = ''
    //GL
    if(this.main.webgl==1){
      this.gl = new gl(this.main)
      funcgl = this.gl.create(texs)
    }


  

    
    // if(import.meta.env.DEV == false){
    // }
    // else{
    //   loadpage = import(this.pages.get(this.template))
    // }

    // this.video = new VideoModal(this.main)
    // this.video.on('start', ()=>this.controlScroll(0))
    // this.video.on('stop', ()=>this.controlScroll(1))

    //Mouse
    if(!this.main.isTouch && typeof Mouse==='function'){
      this.mouse = new Mouse(this.main)
     
    }

    


	  await Promise.all([
      // loadpage,
      // this.pages.get(this.template),
      // waitcanvas,
      funcgl,
      this.timeout(time),
    
    ])

    if(this.gl){
      this.gl.createTemp(this.template)
    }
    this.firstView()
    


  }

  

  async firstView(){
    //Mouse
    if(this.mouse){
      this.mouse.create()
      this.mouse.start()
      this.mouse.reset()
    }
    
    await this.timeout(11)
    await this.loader.hideIntro(this.template)
    if(this.gl){
      this.gl.loader.animstart.play()
    }
    await this.timeout(820)



    if(this.gl){
      this.gl.show()
    }
    

    //State es para diferenciar entre el firstView y un PopState
    this.page.show()
    let state = await this.page.start(0)


    if(this.main.device < 2){

      this.nav.show()
    }
    else{
      this.nav.show()
    }

    this.lenis.start()
    this.addControllers()

    this.isload = 0
  }

  
  
  controlScroll(state){
    if(!this.page){
      return false
    }
    if(state==0){
      this.lenis.stop()
      this.page.stopScroll()
    }
    else{
      this.lenis.start()
      this.page.startScroll()

    }
  }

  update(time) {
    if(this.lenis){
      this.lenis.raf(time)
    }

    if (this.page) {
      this.page.update(this.speed,this.lenis.scroll)
    }
    
    if (this.nav) {
      this.nav.update(time)
    }

    if (this.mouse) {
      this.mouse.update()
    }
    if (this.gl) {
      this.gl.update(time,this.speed,this.lenis.scroll)
    }

    
    gsap.updateRoot(time/ 1000)

    this.upid = window.requestAnimationFrame(this.update)
  }

  timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  
  
  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  // Controllers son modales, popstates y demás
  addControllers () {
    if(this.video){
      this.video.resetLinks()
    }
    this.resetLinks()

  }


  

  


  createScrollCheck(){
    if(this.main.isTouch == 0){
      this.scrollFn = ()=>{
        this.speed = this.lenis.velocity
        

        if(this.page){
  
          // this.page.scroll.target = this.lenis.targetScroll
          // this.page.scroll.current = this.lenis.animatedScroll
          // this.page.scroll.last = this.lenis.animatedScroll
          this.page.animIosScroll()
        }

        // this.scrollanim.progress(this.lenis.progress)


        if(Math.abs(this.speed) < 0.3){
          this.pHide.style.pointerEvents = 'none'
        }
        else{
  
          this.pHide.style.pointerEvents = 'all'
        }
        
  
  
        if(this.speed < 0){
          document.documentElement.classList.add('scroll-up')
        }
        else if(this.speed > 0){
          document.documentElement.classList.remove('scroll-up')
  
        }
  
        if(this.lenis.targetScroll == 0){
          document.documentElement.classList.remove('scroll-start')
        }
        else if(this.lenis.targetScroll > 0){
          document.documentElement.classList.add('scroll-start')
  
        }
        
  
        



      }
    }

    else{
      

      this.scrollFn = ()=>{
        this.speed = this.lenis.velocity
        if(Math.abs(this.speed) < 0.01){
          this.pHide.style.pointerEvents = 'none'
        }
        else{
  
          this.pHide.style.pointerEvents = 'all'
        }
        
        if(!this.page){
          return false
        }
  
        if(this.page.scroll.target > this.lenis.targetScroll){
          document.documentElement.classList.add('scroll-up')
        }
        else if(this.page.scroll.target < this.lenis.targetScroll){
          document.documentElement.classList.remove('scroll-up')
  
        }
  
        if(this.lenis.targetScroll == 0){
          document.documentElement.classList.remove('scroll-start')
        }
        else if(this.lenis.targetScroll > 0){
          document.documentElement.classList.add('scroll-start')
  
        }
        
  
        if(this.page){
  
          this.page.scroll.target = this.lenis.targetScroll
          
          this.page.animIosScroll()
        }
      }

    }


    this.lenis.on('scroll',this.scrollFn)
  }

  createScrollBar(){

    // this.scrBar = document.querySelector('.BGscroll')

    // this.scrollanim = new Interpol({
    //   duration:1000,
    //   paused:true,
    //   ease:'power3.easeInOut',
    //   props: {
    //     width: [0, 100,'%'],
    //   },
    //   onUpdate: ({ width }) => {
    //     if(this.scrBar){
    //       this.scrBar.style.width = width
    //     }
    //   },
    
    // })


  }
  
  getRnd(max){
    return Math.floor(Math.random() * max)
  }

  // writeCt(el){
  //   let fakes = '##·$%&/=€|()@+09*+]}{['
  //   let fakeslength = fakes.length - 1

  //   new window.SplitType(el, { types: 'chars,words' })

  //   let splits = el.querySelectorAll('.char')
  //   for(let [i,a] of splits.entries()){


  //   a.innerHTML = '<span class="n">'+a.innerHTML+'</span>'
    
    
  //   let rnd = 0
  //   for ( let u=0;u<3;u++){
  //     rnd = this.getRnd(fakeslength)
  //     a.insertAdjacentHTML('afterbegin','<span class="f">'+fakes[rnd]+'</span>')

  //   }

    
  //   el.style.opacity = 0

    
  // }

  // }
  // writeFn(parnt){
    
    
  //   let splits = parnt.querySelectorAll('.char')


  //   const anim = gsap.timeline({paused:true})

  //   if(parnt.classList.contains('Awrite-inv')){
      
  //     anim.to(parnt,{opacity:1,duration:1.8,immediateRender:false,ease:'power4.inOut'},0)

  //     // anim
  //     // .add({
  //     //   duration:1800,
  //     //   targets:parnt,
  //     //   opacity:1,
  //     //   autoplay: false,
  //     //   easing:(el,i,t)=>{ 
  //     //     return function(t){
  //     //       return window.Power4.inOut(t) 

  //     //     }
  //     //     return t
        
  //     //   }

  //     // },0)
  //   }
  //   else{
  //     anim.set(parnt,{opacity:1},0)

  //     // parnt.style.opacity = 1
  //   }

  //   for(let [i,a] of splits.entries()){
  //     let n = a.querySelector('.n')


  //     anim
  //     .to(n,{opacity:1,duration:.6,immediateRender:false,ease:'power4.inOut'},i*.1)

  //     // anim
  //     // .add({
  //     //   duration:11,
  //     //   targets:n,
  //     //   opacity:0,
  //     //   easing:'linear',
  //     //   autoplay: false,

  //     // },0)
  //     // .add({
  //     //   duration:600,
  //     //   targets:n,
  //     //   opacity:1,
  //     //   autoplay: false,
  //     //   easing:(el,i,t)=>{ 
  //     //     return function(t){
  //     //       return window.Power4.inOut(t) 

  //     //     }
  //     //     return t
        
  //     //   }
  //     //     // easing:'linear'
  //     // },(i*.1) * 1000)




  //     for(let [u,f] of a.querySelectorAll('.f').entries()){
  //       anim
  //       .set(f,{opacity:0},0)
  //       .fromTo(f,{scaleX:1,opacity:1},{scaleX:0,opacity:0,immediateRender:false,duration:.2,ease:'power4.inOut'},((i*.1) + ((1+u)*.03)))

  //       // anim
  //       // .add({
  //       //   duration:1,
  //       //   targets:f,
  //       //   opacity:0,
  //       //   easing:'linear',
  //       //   autoplay: false,

  //       // },0)
  //       // .add({
  //       //   duration:200,
  //       //   targets:f,
  //       //   opacity:[1,0],
  //       //   scaleX:[1,0],

  //       //   easing:(el,i,t)=>{ 
  //       //     return function(t){
  //       //       return window.Power4.inOut(t) 
  
  //       //     }
  //       //     return t
          
  //       //   }

  //       // },((i*.1) + ((1+u)*.03)) * 1000) 
        
        
        


  //       // console.log((i*.1) * 100)
  //       // console.log(((i*.1) + ((1+u)*.03)) * 100)
  //     }
      
  //   }

  //   anim.play()
  // }


}
//Start
App.prototype.createViews = createViews

//Events
App.prototype.addEvents = addEvents
// App.prototype.onTouchDown = onTouchDown
// App.prototype.onTouchMove = onTouchMove
// App.prototype.onTouchUp = onTouchUp
// App.prototype.onKeyDown = onKeyDown
// App.prototype.onWheel = onWheel
// App.prototype.onScroll = onScroll
App.prototype.onResize = onResize

//Pop
App.prototype.onPopState = onPopState
App.prototype.onChange = onChange
App.prototype.onRequest = onRequest
App.prototype.newView = newView

App.prototype.resetLinks = resetLinks

//Anims

App.prototype.writeFn = writeFn
App.prototype.writeCt = writeCt

//Rest



export default App