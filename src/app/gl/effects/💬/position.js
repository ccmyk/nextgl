
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

      let arr = [.8,2,2]
      // let arr = [.8,2]
      if(this.el.dataset.nome){

        arr = [.8,2,2]
        // arr = [1,1.4]
      }
      this.animstart = gsap.timeline({paused:true})
      .fromTo(this.mesh.program.uniforms.uStart,
       {value:1},
       {
        value:0,
        duration:arr[0],
        ease:'power4.inOut'
       } 
      ,0)
      // .fromTo(this.canvas,
      //   {webkitFilter:'blur('+3+'px)',filter:'blur('+3+'px)'},
      //   {
      //     webkitFilter:'blur('+0+'px)',filter:'blur('+0+'px)',
      //     duration:arr[2],
      //     delay:1,
      //    ease:'power2.inOut'
      //   } 
      //  ,0)
      .fromTo(this.mesh.program.uniforms.uPower,
        {value:.5},
        {
         value:0,
         duration:arr[1],
         ease:'power2.inOut'
        } 
       ,0)
       .set(this.mesh.program.uniforms.uKey,
         
         {
          value:-1,
          onComplete:()=>{

            this.tt.classList.add('act')
            this.stopt = 1
            this.actualChar = -1
          }
         } 
        ,'>')

        this.animstart.play()


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

  if(this.animstart){

    if(this.animstart.progress()!=1){
      
      return false
    }

  }
  if(this.active < 1  ){
    return false
  }




  this.active = 0
  
}
export function updateX (x = 0) {
  
  // this.mesh.position.x = -(this.viewport[0] / 2) + (this.mesh.scale.x / 2) + ((this.bound[0] - x) / this.screen[0]) * this.viewport[0]
  
}
export function updateY (y = 0) {

  // this.mesh.position.y = ((this.viewport[1] / 2) - (this.mesh.scale.y / 2) - ((this.bound[1] - y) / this.screen[1]) * this.viewport[1])
  
} 

export function updateScale () {

  // this.mesh.scale.x = this.viewport[0] * (this.bound[2] * 2.)/ this.screen[0]
  // this.mesh.scale.y = this.viewport[1] * this.bound[3] / this.screen[1]    
}
