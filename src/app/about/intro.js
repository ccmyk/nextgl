
// import './index.scss'
//import SplitType from 'split-type'

export default class {
  constructor (el,device) {


    this.DOM = {
      el:el,
    }
    this.device = device
    this.active = 0

    this.create()
    
  }

  async create(){
   

    this.anim = gsap.timeline({paused:true,onComplete:()=>{
      this.DOM.el.classList.add('act')
    }})
   
    
    
    
    // if(this.device > 1){
    //   this.anim
      
    // }
    // else{
    //   this.anim
    
    // }
    


  
  }
  
  async start(){
    await this.anim.play()
  }
  initEvents(){

  }

  removeEvents(){
    
  }

  onResize(){
  }
}
