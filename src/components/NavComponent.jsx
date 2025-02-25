// import WriteHover from '/atoms🧿🧿🧿/WriteHover';

class Nav {
  constructor(main) {
    this.main = main;
    this.isOpen = false;
    this.clockact = false;
    this.time = 0;
    this.DOM = {};
  }

  async create(temp) {
    document.querySelector('body').insertAdjacentHTML('afterbegin', temp);

    const el = document.querySelector('.nav');
    this.DOM = {
      el,
      burger: el.querySelector('.nav_burger'),
      els: el.querySelectorAll('.nav_right a'),
      city: el.querySelector('.nav_clock_p'),
      c: el.querySelector('.nav_logo'),
      h: el.querySelector('.nav_clock_h'),
      m: el.querySelector('.nav_clock_m'),
      a: el.querySelector('.nav_clock_a'),
    };

    this.DOM.el.style.opacity = '0';

    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();

    this.time = performance.now();

    this.initializeElements();
    this.searchAMPM();
    this.setTime(h, m);
    this.initEvents();
  }

  initializeElements() {
    const elements = ['c', 'city', 'h', 'm', 'a'];
    elements.forEach(el => {
      this.main.events.anim.detail.state = 0;
      this.main.events.anim.detail.el = this.DOM[el];
      document.dispatchEvent(this.main.events.anim);
    });
  }

  setTime(hour = null, minute = null) {
    let m = minute ?? new Date().getMinutes();
    let h = hour;

    if (hour === null || m === 60) {
      this.searchAMPM();
      if (m === 60) m = 0;
    }

    m = m.toString().padStart(2, '0');

    this.updateTimeElement(this.DOM.m, m);

    if (this.clockact) {
      this.triggerAnimation(this.DOM.m);
    }
  }

  searchAMPM(h = null) {
    h = h ?? new Date().getHours();
    const isPM = h >= 12;
    h = h % 12 || 12;

    this.updateAMPMElement(isPM);
    this.updateHourElement(h);

    return h;
  }

  updateTimeElement(element, value) {
    const chars = element.querySelectorAll('.char');
    chars[0].querySelector('.n').innerHTML = value[0];
    chars[1].querySelector('.n').innerHTML = value[1];
  }

  updateAMPMElement(isPM) {
    const chars = this.DOM.a.querySelectorAll('.char');
    chars[0].querySelector('.n').innerHTML = isPM ? 'P' : 'A';
    chars[1].querySelector('.n').innerHTML = 'M';
  }

  updateHourElement(h) {
    const hString = h.toString().padStart(2, '0');
    this.updateTimeElement(this.DOM.h, hString);

    if (this.clockact) {
      this.triggerAnimation(this.DOM.h);
    }
  }

  triggerAnimation(element) {
    this.main.events.anim.detail.state = 1;
    this.main.events.anim.detail.el = element;
    document.dispatchEvent(this.main.events.anim);
  }

  async openMenu() {
    document.documentElement.classList.add('act-menu');
    document.dispatchEvent(this.main.events.openmenu);
  }

  async closeMenu() {
    document.documentElement.classList.remove('act-menu');
    document.dispatchEvent(this.main.events.closemenu);
  }

  async show() {
    this.DOM.el.style.opacity = '1';
    this.triggerAnimation(this.DOM.c);

    this.DOM.c.onmouseenter = () => this.triggerAnimation(this.DOM.c);

    this.DOM.el.querySelector('.nav_clock_s').style.opacity = '1';

    ['city', 'h', 'm', 'a'].forEach(el => this.triggerAnimation(this.DOM[el]));

    this.DOM.els.forEach(a => {
      this.initializeAndShowElement(a);
      a.onmouseenter = () => this.triggerAnimation(a);
    });

    this.clockact = true;
  }

  initializeAndShowElement(element) {
    this.main.events.anim.detail.el = element;
    this.main.events.anim.detail.state = 0;
    document.dispatchEvent(this.main.events.anim);
    this.main.events.anim.detail.state = 1;
    document.dispatchEvent(this.main.events.anim);
  }

  async hide() {
    this.DOM.el.style.opacity = '0';
  }

  initEvents() {
    if (this.DOM.burger) {
      this.DOM.burger.onclick = () => {
        this.isOpen ? this.closeMenu() : this.openMenu();
        this.isOpen = !this.isOpen;
      };
    }
  }

  onResize() {}

  update(time) {
    if (this.time + 60010 <= time) {
      this.time = time;
      this.setTime();
    }
  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default Nav;