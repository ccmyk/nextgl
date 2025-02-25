
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
      // let arr = [.8,2,2]
      this.animstart = gsap.timeline({paused:true})
      .set(this.canvas,{opacity:1},0)
      .fromTo(this.post.passes[0].program.uniforms.uStart,
       {value:-.92},
       {
        value:1.,
        duration:4,
        ease:'power2.inOut'
       } 
      ,0)
      // .fromTo(this.mesh.program.uniforms.uPower,
      //   {value:.5},
      //   {
      //    value:0,
      //    duration:arr[1],
      //    ease:'power2.inOut'
      //   } 
      //  ,0)
      //  .set(this.mesh.program.uniforms.uKey,
         
      //    {
      //     value:-1,
      //     onComplete:()=>{

      //       this.tt.classList.add('act')
      //       this.stopt = 1
      //       this.actualChar = -1
      //     }
      //    } 
      //   ,'>')

        this.animstart.play()


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
