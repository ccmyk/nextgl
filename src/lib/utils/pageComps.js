'use client';

/**
 * Component management utilities for page components
 * These functions are being phased out in favor of React hooks and component lifecycle methods
 */

/**
 * Initialize and load all components registered with the page
 * @returns {Promise<void>}
 */
export async function startComps() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.components) return;
    
    try {
        // Initialize page components
        for (let [index, key] of Object.keys(this.components).entries()) {
            if (Array.isArray(this.components[key])) {
                for (let comp of this.components[key]) {
                    if (comp && comp.load) {
                        await comp.load();
                    }
                    if (comp && comp.initEvents) {
                        comp.initEvents();
                    }
                }
            } else if (this.components[key]) {
                if (this.components[key].load) {
                    await this.components[key].load();
                }
                if (this.components[key].initEvents) {
                    this.components[key].initEvents();
                }
            }
        }
        
        // Initialize intersection observer components
        if (this.ios && Array.isArray(this.ios)) {
            for (let el of this.ios) {
                if (el && el.class) {
                    if (el.class.initEvents) {
                        el.class.initEvents();
                    }
                    if (el.class.load) {
                        if (el.el && el.el.dataset && el.el.dataset.nowait) {
                            el.class.load();
                        } else {
                            await el.class.load();
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error starting components:', error);
    }
}

/**
 * Clean up and remove event listeners from all components
 * @returns {Promise<void>}
 */
export async function stopComps() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.components) return;
    
    try {
        // Clean up page components
        for (let [index, key] of Object.keys(this.components).entries()) {
            if (Array.isArray(this.components[key])) {
                for (let comp of this.components[key]) {
                    if (comp && comp.removeEvents) {
                        comp.removeEvents();
                    }
                }
            } else if (this.components[key] && this.components[key].removeEvents) {
                this.components[key].removeEvents();
            }
        }

        // Clean up intersection observer components
        if (this.ios && Array.isArray(this.ios) && this.observer) {
            for (let el of this.ios) {
                if (el && el.class && el.class.removeEvents) {
                    el.class.removeEvents();
                }
                
                if (el && el.el && this.observer) {
                    this.observer.unobserve(el.el);
                }
            }
        }
    } catch (error) {
        console.error('Error stopping components:', error);
    }
}
