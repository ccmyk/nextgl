export class IntersectionManager {
  constructor() {
    this.observers = new Map();
    this.elements = new Map();
    this.callbacks = new Map();
  }
  
  observe(element, callback, options = {}) {
    if (!element) return;
    
    const id = Math.random().toString(36).substring(2, 9);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (callback) {
          callback(entry.isIntersecting, entry);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
      ...options
    });
    
    observer.observe(element);
    
    this.observers.set(id, observer);
    this.elements.set(id, element);
    this.callbacks.set(id, callback);
    
    return id;
  }
  
  unobserve(id) {
    const observer = this.observers.get(id);
    const element = this.elements.get(id);
    
    if (observer && element) {
      observer.unobserve(element);
      this.observers.delete(id);
      this.elements.delete(id);
      this.callbacks.delete(id);
    }
  }
  
  disconnect() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    this.observers.clear();
    this.elements.clear();
    this.callbacks.clear();
  }
} 