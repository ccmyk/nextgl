import Page from '../lib/utils/pageMain.js'

//COMPS
import Intro from './home/intro.js'
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
      let data = await this.loadRestApi(this.main.base+'/wp-json/wp/v2/pages/',content.dataset.id,content.dataset.template)
      document.querySelector('#content').insertAdjacentHTML('afterbegin',data.csskfields.main)
    }
    this.el = document.querySelector('main')
    this.DOM = {
      el:this.el
    }
    if(this.main.webgl === 0){
      console.log('sisisoos')
      await this.loadImages()
      await this.loadVideos()
    }
    await this.createComps()
    await this.createIos()
    await this.getReady()
  }
  iOpage(animobj){
    if(animobj.el.classList.contains('iO-scroll')){
      animobj.class = new Scroll(animobj,this.main.device)
    }
    return animobj
  }

  async createComps(){
    await super.createComps()
    if(this.DOM.el.querySelector('.home_intro')){
      this.components.intro = new Intro(this.DOM.el.querySelector('.home_intro'),this.main.device)
    }
  }

  async animIntro(val){
    if(this.components.intro){
      this.components.intro.start()
    }
    return val
  }
  async animOut(){
    super.animOut()
  }
}
export default Home