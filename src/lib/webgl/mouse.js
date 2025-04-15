export class MouseManager {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.normalizedX = 0;
    this.normalizedY = 0;
    this.isDown = false;
    this.isMoving = false;
    this.target = null;
    this.bounds = { x: 0, y: 0, width: 0, height: 0 };
    
    this.handlers = {
      move: [],
      down: [],
      up: [],
      enter: [],
      leave: []
    };
    
    this.init();
  }
  
  init() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    window.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // Touch events
    window.addEventListener('touchstart', this.handleTouchStart.bind(this));
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  setTarget(element) {
    this.target = element;
    this.updateBounds();
  }
  
  updateBounds() {
    if (this.target) {
      const rect = this.target.getBoundingClientRect();
      this.bounds = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    }
  }
  
  handleMouseMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    this.isMoving = true;
    
    if (this.target) {
      this.normalizedX = (this.x - this.bounds.x) / this.bounds.width;
      this.normalizedY = (this.y - this.bounds.y) / this.bounds.height;
    }
    
    this.handlers.move.forEach(handler => handler(e));
  }
  
  handleMouseDown(e) {
    this.isDown = true;
    this.handlers.down.forEach(handler => handler(e));
  }
  
  handleMouseUp(e) {
    this.isDown = false;
    this.handlers.up.forEach(handler => handler(e));
  }
  
  handleMouseEnter(e) {
    this.handlers.enter.forEach(handler => handler(e));
  }
  
  handleMouseLeave(e) {
    this.handlers.leave.forEach(handler => handler(e));
  }
  
  handleTouchStart(e) {
    if (e.touches.length > 0) {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
      this.isDown = true;
      
      if (this.target) {
        this.normalizedX = (this.x - this.bounds.x) / this.bounds.width;
        this.normalizedY = (this.y - this.bounds.y) / this.bounds.height;
      }
      
      this.handlers.down.forEach(handler => handler(e));
    }
  }
  
  handleTouchMove(e) {
    if (e.touches.length > 0) {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
      this.isMoving = true;
      
      if (this.target) {
        this.normalizedX = (this.x - this.bounds.x) / this.bounds.width;
        this.normalizedY = (this.y - this.bounds.y) / this.bounds.height;
      }
      
      this.handlers.move.forEach(handler => handler(e));
    }
  }
  
  handleTouchEnd(e) {
    this.isDown = false;
    this.handlers.up.forEach(handler => handler(e));
  }
  
  on(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].push(handler);
    }
  }
  
  off(event, handler) {
    if (this.handlers[event]) {
      const index = this.handlers[event].indexOf(handler);
      if (index !== -1) {
        this.handlers[event].splice(index, 1);
      }
    }
  }
} 