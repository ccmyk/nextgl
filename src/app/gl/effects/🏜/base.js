// 🏜️ TERRAIN
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateAnim,
  updateScale

} from './position.js'

import {  Vec2 } from 'ogl'


class Base {
  constructor (obj) {
   
    this.el = obj.el
    this.pos = obj.pos
    this.renderer = obj.renderer
    this.mesh = obj.mesh
    this.canvas = obj.canvas
    this.program = obj.mesh.program

    this.active = -1
    this.isready = 0
    

    this.ctr = {
      actual:0,
      current:0,
      limit:0,
      start:0,
      prog:0,
      progt:0,
      stop:0
    }

    this.initEvents()

  }


  update(time,speed,pos){
    if(!this.renderer){
      return false
    }
    if(this.isready == 0 || this.active != 1){
      return false
    }

    if(this.ctr.actual != pos){
      this.ctr.actual = pos
      this.updateY(pos)

      if(this.ctr.stop != 1){
        this.updateAnim()
  
      }
      this.program.uniforms.uTime.value = time || 0
    
    }
  }
  initEvents(){
    // let uStartgo = document.querySelector('#uStartgo')
    // uStartgo.oninput = (e) =>{
    //   gsap.fromTo(this.program.uniforms.uStart0,{value:1},{value:0,duration:1,ease:'power4.inOut'})
    //   gsap.fromTo(this.program.uniforms.uStart1,{value:.5},{value:1,duration:2,ease:'power2.inOut'})
    //   gsap.fromTo(this.program.uniforms.uStart2,{value:1},{value:0,duration:2.6,ease:'power4.inOut'})
    // }

    this.animstart = gsap.timeline({paused:true,
      onUpdate:()=>{

        this.renderer.render({ scene: this.mesh })
      }
      ,onComplete:()=>{
        // this.active = 0
        // document.querySelector('#uStart0').parentNode.style.display ='flex'
      }})
    // FIRST OPTION, VERY LONG AND TOO MUCH DETAIL
    // .fromTo(this.program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStartX,{value:0},{value:-.5,duration:3,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uMultiY,{value:0.45},{value:0.1,duration:2,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},1.2)

    // MOUNTAIN OPTION, GOOD TIMINGS
    // .fromTo(this.program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStartX,{value:0},{value:-.5,duration:2,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    
    // .fromTo(this.program.uniforms.uMultiY,{value:0.45},{value:0.1,duration:2,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},.6)

    .fromTo('.home_about .cnt_tp',{opacity:1},{opacity:0,duration:.15},.9)

    
    // VERY LITTLE MOUNTAIN, IF I REMOVE THE MULTIX, THE MOUNTAIN IS NOTICED A BIT MORE
    .fromTo(this.program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    .fromTo(this.program.uniforms.uStartX,{value:0},{value:-.1,duration:2,ease:'power2.inOut'},0)
    // .set(this.program.uniforms.uMultiX,{value:-.4},0)
    .fromTo(this.program.uniforms.uMultiX,{value:-.4},{value:0.1,duration:2,ease:'power2.inOut'},0)
    
    .fromTo(this.program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    .fromTo(this.program.uniforms.uMultiY,{value:0.45},{value:0.3,duration:2,ease:'power2.inOut'},0)
    .fromTo(this.program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},.6)


    // ZERO MOUNTAIN, IF I REMOVE THE SET TO MULTIX IT'S ALMOST STRAIGHT 
    // .fromTo(this.program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStartX,{value:0},{value:-.1,duration:2,ease:'power2.inOut'},0)
    // .set(this.program.uniforms.uMultiX,{value:0.01},0)
    // .fromTo(this.program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uMultiY,{value:0.45},{value:0.3,duration:2,ease:'power2.inOut'},0)
    // .fromTo(this.program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},.6)

    // .fromTo(this.program.uniforms.uMultiX,{value:-.4},{value:-.34,duration:3,ease:'power2.inOut'},0)
    .fromTo('.nav',{'--dark':'#F8F6F2','--gray':'#8A8A8A','--light':'#000'},{'--dark':'#000','--gray':'#8A8A8A','--light':'#F8F6F2',duration:.5},.1)
    this.animstart.progress(1)

  }
  removeEvents(){
    this.active = -2
    gsap.timeline({
      onUpdate:()=>{
        this.renderer.render({ scene: this.mesh })

      },
      onComplete:()=>{
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()

      }
    })
    .to('.home_about .cnt_tp',{opacity:0,duration:.6},0)
    .to(this.program.uniforms.uStart0,{value:1,duration:.4,ease:'power2.inOut'},0)
    .to(this.program.uniforms.uStartX,{value:-.1,duration:1,ease:'power2.inOut'},0)
    // .set(this.program.uniforms.uMultiX,{value:-.4},0)
    .to(this.program.uniforms.uMultiX,{value:0.1,duration:1,ease:'power2.inOut'},0)
    
    .to(this.program.uniforms.uStartY,{value:0.95,duration:1,ease:'power2.inOut'},0)
    .to(this.program.uniforms.uMultiY,{value:0.3,duration:1,ease:'power2.inOut'},0)
    .to(this.program.uniforms.uStart2,{value:0,duration:.5,ease:'power2.inOut'},.3)
    .to('.nav',{'--dark':'#000','--light':'#F8F6F2',duration:.5},0)
    
  }
  onResize(viewport,screen){


    this.viewport = [viewport.w,viewport.h]
    this.screen = [screen.w,screen.h]

    let bound = this.el.getBoundingClientRect()
    this.bound = [bound.x,bound.y,bound.width,bound.height]
    // this.w = window.innerWidth
    // this.h = window.innerHeight
    let calc = 0

    this.ctr.start =  parseInt((bound.y - screen.h + window.scrollY ))
    this.ctr.limit = parseInt((bound.height + calc ))

    if(this.renderer){
      this.renderer.setSize(screen.w, screen.h)
      this.program.uniforms.uResolution.value = [screen.w, screen.h]
    }

  }

}

Base.prototype.check = check
Base.prototype.start = start
Base.prototype.stop = stop
Base.prototype.updateX = updateX
Base.prototype.updateY = updateY
Base.prototype.updateAnim = updateAnim
Base.prototype.updateScale = updateScale


export default Base