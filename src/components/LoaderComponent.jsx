// src/components/LoaderComponent.jsx

class Loader {
  constructor(main, temp, device) {
    this.main = main;
    this.counter = 0;
    this.index = 0;
    this.temp = { init: temp, pop: temp };
    this.device = device;
    this.DOM = {};
    this.obj = { num: 0 };
  }

  async create() {
    document.querySelector('body').insertAdjacentHTML('afterbegin', this.temp.init);

    this.DOM = {
      el: document.documentElement.querySelector('.loader'),
      bg: document.documentElement.querySelector('.loader .loader_bg'),
      cnt: document.documentElement.querySelector('.loader .loader_cnt'),
      n: document.documentElement.querySelector('.loader .loader_tp'),
    };

    this.createAnim();
  }

  createAnim() {
    this.anim = gsap.timeline({ paused: true })
      .fromTo(
        this.obj,
        { num: 0 },
        {
          num: 42,
          ease: 'none',
          duration: 2,
          onUpdate: () => this.updateNumber(),
        },
        0
      )
      .to(
        this.obj,
        {
          num: 90,
          ease: 'power2.inOut',
          duration: 8,
          onUpdate: () => this.updateNumber(),
        },
        2.2
      );

    const aw = this.DOM.el.querySelectorAll('.Awrite');
    aw.forEach(element => this.initializeAnimation(element));
  }

  updateNumber() {
    const num = this.obj.num.toFixed(0).padStart(3, '0');
    this.DOM.n.innerHTML = num;
  }

  initializeAnimation(element) {
    this.main.events.anim.detail.state = 0;
    this.main.events.anim.detail.el = element;
    document.dispatchEvent(this.main.events.anim);
  }

  async hide() {}
  async show() {}

  async start() {
    const aw = this.DOM.el.querySelectorAll('.Awrite');
    aw.forEach(element => this.triggerAnimation(element));
    this.anim.play();
  }

  triggerAnimation(element) {
    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = element;
    document.dispatchEvent(this.main.events.anim);
  }

  async showPop() {
    if (this.device > 1) {
      // Implement showPop logic for device > 1
    }
  }

  async hidePop() {
    if (this.device > 1) {
      this.DOM.el.remove();
    }
  }

  async hideIntro(template = '') {
    this.anim.pause();

    gsap.to(this.obj, {
      num: 100,
      ease: 'power2.inOut',
      duration: 0.49,
      onUpdate: () => this.updateNumber(),
    });

    gsap.to(this.DOM.el, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.DOM.el.remove();
      },
    });
  }
}

export default Loader;