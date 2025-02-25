
export function check(entry){
    let vis = false
      
    vis = entry.isIntersecting
    
    if(vis == 1){
      this.start()

    }
    else if(vis == 0){
      this.stop()
    }
    return vis

}


export function start(){

    if(this.active == 1){
      return false
    }

    if(this.active == -1){
      


      // let anim = anime.timeline({
      //   autoplay: false
      // })
      // .add({
      //   duration:800,
      //   targets:this.mesh.program.uniforms.uStart,
      //   value:[1,0],
      //   autoplay: false,
      //   easing:(el,i,t)=>{ 
      //     return function(t){
      //       return window.Power4.inOut(t) 

      //     }
      //     return t
        
      //   }

      // },0)
      // .add({
      //   duration:2000,
      //   targets:this.mesh.program.uniforms.uPower,
      //   value:[2,0],
      //   autoplay: false,
      //   easing:(el,i,t)=>{ 
      //     return function(t){
      //       return window.Power2.out(t) 

      //     }
      //     return t
        
      //   }

      // },0)
      // .add({
      //   duration:11,
      //   targets:this.mesh.program.uniforms.uKey,
      //   value:-1,
      //   autoplay: false,
      //   complete:()=>{
      //     this.tt.classList.add('act')
      //     this.actualChar = -1
      //   }

      // },2000)

    }
    this.active = 1
   
}

export function stop(){

  
  this.end = 0
  this.ctr.prog = 0
  this.ctr.progt = 0
  this.animctr.progress(0)
  if(this.active < 1  ){
    return false
  }




  this.active = 0
  
}
export function updateX (x = 0) {
  
  // this.mesh.position.x = -(this.viewport[0] / 2) + (this.mesh.scale.x / 2) + ((this.bound[0] - x) / this.screen[0]) * this.viewport[0]
  
}
export function updateY (y = 0) {
  if(this.ctr.stop != 1){
    this.ctr.current = y - this.ctr.start
    this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current)
  }

  // this.mesh.position.y = ((this.viewport[1] / 2) - (this.mesh.scale.y / 2) - ((this.bound[1] - y) / this.screen[1]) * this.viewport[1])
  
} 

export function updateAnim () {

  this.ctr.progt = parseFloat(this.ctr.current  / this.ctr.limit).toFixed(3)
  this.ctr.prog = lerp(this.ctr.prog , this.ctr.progt , .015)
  // this.ctr.prog = parseFloat(this.ctr.prog).toFixed(3)
  this.animctr.progress(this.ctr.prog)
}

export function updateScale () {

  // this.mesh.scale.x = this.viewport[0] * (this.bound[2] * 2.)/ this.screen[0]
  // this.mesh.scale.y = this.viewport[1] * this.bound[3] / this.screen[1]    
}
