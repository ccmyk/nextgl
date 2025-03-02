/**
 * LazyVideo class for lazy loading videos with Intersection Observer
 * @deprecated This class-based approach is being phased out in favor of Next.js Video component
 * and React hooks for lazy loading
 */
export default class LazyVideo {
  /**
   * Constructor for the LazyVideo class
   * @param {object} obj - Object containing the video element and other properties
   * @param {boolean} touch - Whether the device is touch-enabled
   * @param {boolean} canplay - Whether the video can be played
   * @param {object} animev - Animation event object
   */
  constructor(obj, touch, canplay, animev) {
    // Don't initialize on server
    if (typeof window === 'undefined') return;
    
    this.el = obj.el;
    this.pos = obj.pos;
    this.touch = touch;
    this.canplay = canplay;
    this.animev = animev;
    
    this.DOM = {
      el: obj.el,
      video: obj.el.parentNode.querySelector('video'),
    };
    
    this.auto = false;
    if (this.DOM.video && this.DOM.video.dataset.auto) {
      this.auto = true;

      this.DOM.video.loop = true;
      this.DOM.video.muted = true;
      this.DOM.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
      this.DOM.video.setAttribute('playsinline', 'playsinline');

      if (this.touch) {
        this.DOM.video.load();
      }
    }

    this.active = 0;
    this.isloaded = 0;
    this.togglein = 0;

    this.create();
  }
  
  /**
   * Initialize the lazy video
   */
  create() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    this.toggleAudio = async(out = null) => {
      if (!this.DOM || !this.DOM.b || this.togglein == 1) {
        return false;
      }
      
      this.togglein = 1;
      
      if (out == 1 || (this.DOM.video && this.DOM.video.muted == false)) {
        if (this.DOM.video) {
          this.DOM.video.muted = true;
        }

        if (this.animev && this.DOM.bOn) {
          this.animev.detail.state = -1;
          this.animev.detail.el = this.DOM.bOn;
          document.dispatchEvent(this.animev);
        }

        try {
          await this.timeout(64);
        } catch (error) {
          console.error('Error in timeout:', error);
        }
        
        if (this.animev && this.DOM.bOff) {
          this.animev.detail.state = 1;
          this.animev.detail.el = this.DOM.bOff;
          document.dispatchEvent(this.animev);
        }
      }
      else {
        if (this.DOM.video) {
          this.DOM.video.muted = false;
        }
        
        if (this.animev && this.DOM.bOff) {
          this.animev.detail.state = -1;
          this.animev.detail.el = this.DOM.bOff;
          document.dispatchEvent(this.animev);
        }

        try {
          await this.timeout(64);
        } catch (error) {
          console.error('Error in timeout:', error);
        }

        if (this.animev && this.DOM.bOn) {
          this.animev.detail.state = 1;
          this.animev.detail.el = this.DOM.bOn;
          document.dispatchEvent(this.animev);
        }
      }

      try {
        await this.timeout(320);
      } catch (error) {
        console.error('Error in timeout:', error);
      }

      this.togglein = 0;
    };

    // Helper timeout function
    this.timeout = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    if (this.DOM && this.DOM.el && this.DOM.el.parentNode && this.DOM.el.parentNode.querySelector('button.cAudio')) {
      this.DOM.b = this.DOM.el.parentNode.querySelector('button.cAudio');

      if (this.DOM.b) {
        this.DOM.bOn = this.DOM.b.querySelector('.on');
        this.DOM.bOff = this.DOM.b.querySelector('.off');
        
        if (this.animev && this.DOM.bOn) {
          this.animev.detail.state = 0;
          this.animev.detail.el = this.DOM.bOn;
          document.dispatchEvent(this.animev);
        }

        if (this.animev && this.DOM.bOff) {
          this.animev.detail.state = 0;
          this.animev.detail.el = this.DOM.bOff;
          document.dispatchEvent(this.animev);

          this.animev.detail.state = 1;
          this.animev.detail.el = this.DOM.bOff;
          document.dispatchEvent(this.animev);
        }

        this.DOM.b.onclick = () => this.toggleAudio();
      }
    }
  }
  
  /**
   * Check if the video is in view and load it if necessary
   * @param {IntersectionObserverEntry} entry - Intersection observer entry
   * @param {number} pos - Position
   * @returns {boolean} - Status code
   */
  check(entry, pos) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return false;
    
    let vis = false;
    let isPlaying = false;

    if (!entry || entry.isIntersecting == undefined) {
      return false;
    }
    else if (entry.isIntersecting == true) {
      this.start();
      
      if (!this.DOM.video) return false;
      
      if (this.isloaded == 1) {
        if (this.touch == 0) {
          try {
            this.DOM.video.play();
          } catch (error) {
            console.error('Error playing video:', error);
          }
        }
        else {
          this.DOM.video.setAttribute('autoplay', 'true');
        }
      }
      else {
        if (this.DOM.video.dataset.lazy) {
          this.DOM.video.src = this.DOM.video.dataset.lazy;
          if (this.touch == 0) {
            try {
              this.DOM.video.play();
            } catch (error) {
              console.error('Error playing video:', error);
            }
          }
          else {
            this.DOM.video.setAttribute('autoplay', 'true');
          }
        }
      }
    }
    else {
      this.stop();
      
      if (!this.DOM.video) return false;
      
      isPlaying = this.DOM.video.currentTime > 0 && 
                 !this.DOM.video.paused && 
                 !this.DOM.video.ended && 
                 this.DOM.video.readyState > this.DOM.video.HAVE_CURRENT_DATA;
      
      if (isPlaying) {
        if (this.touch == 1) {
          this.DOM.video.setAttribute('autoplay', 'false');
          this.toggleAudio(1);
        }
        else {
          try {
            this.DOM.video.pause();
          } catch (error) {
            console.error('Error pausing video:', error);
          }
          this.toggleAudio(1);
        }
      }
    }
    
    return false;
  }
  
  /**
   * Start displaying the video
   */
  start() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    this.active = 1;
    if (this.DOM && this.DOM.video) {
      this.DOM.video.classList.add('ivi');
    }
  }
  
  /**
   * Stop displaying the video
   */
  stop() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;

    this.active = 0;
    if (this.DOM && this.DOM.video) {
      this.DOM.video.classList.remove('ivi');
    }
  }
  
  /**
   * Initialize event listeners
   */
  initEvents() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.DOM || !this.DOM.video) return;
    
    this.DOM.video.oncanplay = () => {
      this.isloaded = 1;
      this.DOM.video.classList.add('Ldd');
    };
    
    this.DOM.video.onplay = () => {
      this.DOM.video.isPlaying = true;
    };
  }
  
  /**
   * Remove event listeners
   */
  removeEvents() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (this.DOM && this.DOM.video) {
      this.DOM.video.oncanplay = null;
      this.DOM.video.onplay = null;
    }
  }
  
  /**
   * Update the video state
   */
  update() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  }

  /**
   * Handle resize events
   * @param {number} scrollCurrent - Current scroll position
   */
  onResize(scrollCurrent) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.el) return;
    
    this.h = window.innerHeight;
    this.max = this.el.clientHeight;
    
    this.checkobj = {
      firstin: Math.min(this.h, this.el.clientHeight) * .92,
      firstout: this.h * .92,
      secout: this.el.clientHeight * -1,
      limit: this.el.clientHeight,
    };
  }
}
