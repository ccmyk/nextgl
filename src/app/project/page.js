import Page from '../..pageMain.js'

//COMPS
import Intro from ./intro.js'
import In from './ioin.js'
import Nxt from './io.js'



class Home extends Page {
  constructor (main) {
    super(main)
  }

  async create(content,main,temp=undefined) {
    super.create(content,main)
    if(temp!=undefined){

      document.querySelector('#content').insertAdjacentHTML('afterbegin',temp)
    }
    else{
      let data = await this.loadRestApi(this.main.base+'/wp-json/wp/v2/project/',content.dataset.id,content.dataset.template)
      
      document.querySelector('#content').insertAdjacentHTML('afterbegin',data.csskfields.main)
    }
    this.el = document.querySelector('main')
    

    this.DOM = {
      el:this.el
    }

    await this.loadImages()
    await this.loadVideos()
    


    await this.createComps()
    await this.createIos()
    

    await this.getReady()
  }
  iOpage(animobj){
    if(animobj.el.classList.contains('iO-outin')){

      animobj.class = new In(animobj,this.main.device) 
      
    }
    else if(animobj.el.classList.contains('iO-nxt')){

      animobj.class = new Nxt(animobj,this.main.device,this.main.events.nextprj) 
      
    }
    
    return animobj
  }

  
  
  async createComps(){
   


    await super.createComps()
    if(this.DOM.el.querySelector('.project_intro')){
      this.components.intro = new Intro(this.DOM.el.querySelector('.project_intro'),this.main.device)
    
    }
    
    

  }


  async animIntro(val){

    
    if(document.querySelector('.faketit')){
      this.components.intro.set()
    }
    else{
      await this.components.intro.start()

    }




    return val
   
  }

  async animOut(btn,lenis){


    let lds = this.DOM.el.querySelectorAll('.ivi.Ldd')
    for(let a of lds){
      a.classList.remove('Ldd')

    }
    let t = ''
    let n = ''
    let time = 1200
    const anim = gsap.timeline({paused:true})
    if(btn == null){
      super.animOut()
      return true

    }
    else if(btn.classList.contains('nxtPr')){

      n = btn.querySelector('.cnt_n')
      t = btn.querySelector('.cnt_t')

      n.classList.add('nfo_n')
      t.classList.add('nfo_t')
      if(this.main.device < 2){
        
        gsap.set(t,{x:34.4+'rem'})
      
      }

      // super.animOut()
      return [n,t]
    }
    else{
      super.animOut()
      return true

    }

    
   
  }
  

}




export default Home