
export function check(entry){
    let vis = false
      
    vis = entry.isIntersecting

    if(vis == 1){
      this.start(entry)

    }
    else if(vis == 0){
      this.stop(entry)
    }
    return vis

}


export function start(entry){
  // console.log(this.meshes)
  // console.log(this.scene)
  // console.log(this.renderer)
  // console.log(this.post)

    
  
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    if(this.state == 1){
      // if(this.el.dataset.ids != 1){
      //   return false
      // }

      if(this.single){
        if(this.oldpos > window.scrollY){
          // WE ARE GOING UP
        // console.log(entry.boundingClientRect.y)
            
            // if(entry.boundingClientRect.y > (this.h - 100 - entry.boundingClientRect.height )){
            // console.log('toco por abajo')
            if(entry.boundingClientRect.y > 60){
              this.single.style.pointerEvents = 'all'
              // this.single.style.opacity = .4

            }
            else{
              // this.single.style.opacity = 0
              // this.single.style.pointerEvents = 'none'
            }
        }
        else{

          // WE ARE GOING DOWN

            // if(entry.boundingClientRect.y > this.h * .9){
            //   console.log('baja y entra por abajo, empieza a verse ')
            if(entry.boundingClientRect.y > 60){
                this.single.style.pointerEvents = 'all'
                // this.single.style.opacity = .4
            
              
            }
            else{
              // this.single.style.opacity = 0
              this.single.style.pointerEvents = 'none'
            }
            

          // WE ARE GOING DOWN

        }
        this.oldpos = window.scrollY

      }
    }
    else{
      gsap.set(this.canvas,{display:'block'})
      if(this.animin){
  
        this.animin.play()
        if(this.touchl){
          this.active = 1
        }
        return false
      }
    }
    if(this.active == 1 ){
      return false
    }

    // this.post.render({scene:this.scene,camera:this.camera})
    // this.loss.restoreContext()
    
    
    this.active = 1

        for(let a of this.textures){
          if(a.image.tagName == 'VIDEO'){
            a.image.play()
          }
        }
      
    this.slideanim.play()
    
   
}

export function stop(entry){
  gsap.set(this.canvas,{display:'none'})
  if(this.state == 1){
    // if(this.el.dataset.ids != 0){
    //   return false
    // }
    if(this.single){

      this.single.style.pointerEvents = 'none'
      this.single.style.opacity = 0

      this.oldpos = window.scrollY
    }
  }
  if(this.active < 1 || this.state != 0 ){
    return false
  }
  this.slideanim.pause()
  for(let a of this.textures){
    if(a.image.tagName == 'VIDEO'){
      a.image.pause()
    }
  }


  this.active = 0
  
}
export function updateX (sum = 0) {
  
  this.statepos = (this.objpos.x * this.totalpos) / 1
  
    let x = 0
    for(let [i,a] of this.meshes.entries()){
      
      x = this.posmeshes[i]

      x -= this.statepos
      
      if(x <= this.minpos ){

        this.posmeshes[i] = this.statepos + this.maxpos + this.space

      }


      a.position.x = -(this.viewport[0] / 2) + (a.scale.x / 2) + ((x  ) / this.screen[0]) * this.viewport[0]



    }
}
export function updateY (y = 0,state = 0) {

  if(this.ctr.stop != 1){
    this.ctr.current = y - this.ctr.start
    this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current)
  }

} 

export function updateAnim () {

    
  
    this.ctr.progt = (this.ctr.current  / this.ctr.limit).toFixed(3)
    
    if(this.active == -2){
      this.ctr.prog = this.ctr.progt
    }
    else{
      this.ctr.prog = lerp(this.ctr.prog , this.ctr.progt , .015)
      
    }
    this.animctr.progress(this.ctr.prog)
}

export function updateScale () {

  let w = this.screen[0]*.322
  let h = this.bound[3]
  if(this.device < 3){
    w = this.screen[0]*.322

  }
  else{
    w = this.screen[0]*.75
    // h = (this.screen[0]*.8) * .5

  }

  for(let [i,a] of this.meshes.entries()){
    a.scale.x = this.viewport[0] * w / this.screen[0]
    a.scale.y = this.viewport[1] * h / this.screen[1]    

  }
}
