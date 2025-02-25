
export function onResize (){

  
  // if(! this.camera ){
  //   return false
  // }

  // this.aspect = this.main.screen.w/this.main.screen.h
  // this.renderer.setSize(this.main.screen.w, this.main.screen.h)

  // this.camera.perspective({
  //   aspect: this.gl.canvas.width / this.gl.canvas.height
  // })


  // const fov = this.camera.fov * (Math.PI / 180)
  // const height = 2 * Math.tan(fov / 2) * this.camera.position.z
  // const width = height * this.camera.aspect

  // this.viewport = {
  //   w:width,
  //   h:height
  // }

  // this.scale = this.main.screen.h / 1500
  for(let [i,a] of this.iosmap.entries()){
    if(a.onResize) a.onResize(this.viewport,this.main.screen)
    
  }
  if(this.loader){
    this.loader.onResize(this.viewport,this.main.screen)
  }
}



// export function update({speed,scroll,mouse,mousespeed}) {
export function update(time,wheel,pos) {
  if(this.loader){
    if(this.loader.active != 0){
      this.loader.update(time,wheel,pos)
    }
    else if(this.loader.active == 0){
      this.loader.removeEvents()
      delete this.loader
    }
    
  }
  if(this.isVisible == 0){
    return false
  }

  let renderme = 0

  if(this.ios){
    for(let [i,a] of this.iosmap.entries()){
      
      if(a.active==1){
        a.update(time,wheel,pos)
        
        // if(!a.renderer){
        //   renderme = 1
        // }
       

        
      }
      
    }
  }
  // if(renderme == 1){
  //   this.renderer.render({
  //     scene: this.scene,
  //     camera: this.camera
  //   })
  // }
  // this.renderer.render({
  //   scene: this.scene,
  //   camera: this.camera
  // })


  // if(this.iosmap){
  //   if(this.iosmap.get(0)){
  //     this.iosmap.get(0).update(time,wheel,pos)
  //   }
  //   if(this.iosmap.get(1)){
  //     this.iosmap.get(1).update(time,wheel,pos)
  //   }
  // }





}


export function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}


export async function loadImage(url) {
  
  return new Promise((resolve, reject) => {
    
    let img = new Image()
    img.crossOrigin = ''
   


    
    // let gif=0
    // if(/\.(gif)$/.test(url)){
    //   gif=1
    // }

    

    img.onload = () =>{
      resolve(img)
    }

    img.src = url
    
    
    img.onerror = (e) =>{
      resolve(img)
    }
  })


}


function cleanVid(elem){
  elem.oncanplay = null
  elem.onplay = null
  elem.currentTime=0

  let isPlaying = elem.currentTime > 0 && !elem.paused && !elem.ended 
  && elem.readyState > elem.HAVE_CURRENT_DATA


  elem.pause()
}


export async function loadVideo(elem,url) {
  // Add preload="metadata" to video tag and then listen to loadedmetadata event. It works in IOS Safari as well


  return new Promise((resolve, reject) => {
    if(elem.dataset.loop){
      elem.loop = false
    }
    else{
      elem.loop = true
    }
    elem.muted = true
    elem.autoplay = true
    elem.setAttribute('webkit-playsinline', 'webkit-playsinline')
    elem.setAttribute('playsinline', 'playsinline')
    elem.onplay = () => {

      elem.isPlaying = true
      
    }
    
    elem.oncanplay = () => {
      if (elem.isPlaying) {
        elem.classList.add('Ldd')
        cleanVid(elem)
        resolve(elem)
      }
    }
    elem.src = url
    
    
    elem.onerror = () =>{
      resolve(elem)
    }
    
    elem.play()
    
  })

}