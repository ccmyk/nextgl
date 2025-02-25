
export function check(entry){
    let vis = false
      
    vis = entry.isIntersecting
    
    if(vis == 1){
      this.start()

    }
    else if(vis == 0){
      this.stop(entry)
    }
    return vis

}


export function start(){
    if(this.active == 1){
      return false
    }

    if(this.active == -1){
      


    }
    this.active = 1
    // THE SAME IS THE PLAY ONLY IF IT IS GOING TO ENTER
    if(this.state == 1){
      // for(let a of this.medias){
      //   if(a.tagName == 'VIDEO'){
        
      //     a.play()
      //   }
      // }
    }
   
}

export function stop(entry){
  if(this.active < 1  ){
    return false
  }

  // THE SAME IS THE PLAY ONLY IF IT IS GOING TO ENTER
  if(this.state == 1){
    // for(let a of this.medias){
    //   if(a.tagName == 'VIDEO'){
    //     a.play()
    //   }
    // }
    if(entry.intersectionRect.y > 0){
      return false
    }
    gsap.to(this.animctr,{progress:1,duration:.2,
      onStart:()=>{
      
      },
      onComplete:()=>{

        this.ctr.current = this.ctr.limit
        this.ctr.target = this.ctr.limit
        this.ctr.prog = 1
        this.ctr.progress = 1
      
      }
    })

  }



  this.active = 0
  
}
export function updateX (sum = 0) {

  
}
export function updateY (y = 0) {
    if(this.ctr.stop != 1){
      this.ctr.current = y - this.ctr.start
      this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current)
    }
} 

export function updateAnim () {

    this.ctr.progt = (this.ctr.current  / this.ctr.limit).toFixed(3)
    this.ctr.prog = lerp(this.ctr.prog , this.ctr.progt , .03)    
    this.animctr.progress(this.ctr.prog)

    // console.log(this.ctr.progt)
}

export function updateScale () {


  // a.scale.x = (this.viewport[0] * this.parent.clientWidth / this.screen[0]) * 2
  // a.scale.y = (this.viewport[1] * this.parent.clientHeight / this.screen[1]) * 2 
  
}
