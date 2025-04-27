# Portfolio Refactoring: Vanilla JS to Next.js

## Project Overview and Goals

**Date Started:** April 27, 2025  
**Team:** ChrisHall, AI Assistant  
**Source Repository:** https://github.com/ccmyk/legacy-vanilla-js  
**Target Repository:** https://github.com/ccmyk/nextgl  

### Project Goals

1. **Platform Modernization:** Convert a vanilla JavaScript portfolio to a modern Next.js application
2. **Code Quality Improvement:** Refactor monolithic structure into modular, maintainable components
3. **Performance Optimization:** Leverage Next.js features for improved loading and rendering performance
4. **Design Fidelity:** Maintain identical visual appearance and interactive behaviors
5. **CSS Modernization:** Convert monolithic CSS to modular PostCSS (.pcss) structure
6. **WebGL Migration:** Properly adapt complex WebGL implementations to React/Next.js lifecycle

## Initial State Analysis

### Legacy Project (Vanilla JS)

The legacy project follows a monolithic vanilla JavaScript architecture with WebGL implementations:

```
/tmp/legacy-vanilla-js
├── index.html                         # Entry point with all HTML markup
└── wp-content                         # WordPress theme structure
    └── themes
        ├── csskiller_wp
        │   ├── index.css              # Monolithic CSS file
        │   └── public
        │       └── fonts              # Font assets
        └── src                        # Main source code
            ├── components             # UI Components
            │   ├── Loader             # Loading screen
            │   │   └── index.js
            │   ├── Mouse              # Custom mouse cursor
            │   │   └── index.js
            │   └── Nav                # Navigation component
            │       └── index.js
            ├── gl                     # WebGL implementation
            │   ├── create.js          # WebGL initialization
            │   ├── els.js             # Element selection
            │   ├── events.js          # Event handling
            │   ├── gl.js              # Main WebGL logic
            │   ├── ios.js             # iOS specific handling
            │   ├── Loader             # WebGL loader component
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── main.frag      # Fragment shader
            │   │   └── main.vert      # Vertex shader
            │   ├── Background         # Background effects
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── main.frag      # Fragment shader
            │   │   ├── parent.frag    # Parent fragment shader
            │   │   └── main.vert      # Vertex shader
            │   ├── Title              # Title component
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── single.frag    # Fragment shader
            │   │   └── single.vert    # Vertex shader
            │   ├── Footer             # Footer component
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── main.frag      # Fragment shader
            │   │   └── main.vert      # Vertex shader
            │   ├── Roll               # Roll effects
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── msdf.frag      # MSDF Fragment shader
            │   │   └── parent.frag    # Parent fragment shader
            │   ├── About              # About section
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── msdf.frag      # MSDF Fragment shader
            │   │   └── msdf.vert      # MSDF Vertex shader
            │   ├── Base               # Base component
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations
            │   │   ├── msdf.frag      # MSDF Fragment shader
            │   │   └── parent.frag    # Parent fragment shader
            │   ├── Slides             # Slides component
            │   │   ├── base.js        # Base component setup
            │   │   ├── position.js    # Position calculations 
            │   │   ├── main.frag      # Fragment shader
            │   │   └── main.vert      # Vertex shader
            │   └── Pg                 # Playground component
            │       ├── base.js        # Base component setup
            │       ├── position.js    # Position calculations
            │       ├── main.frag      # Fragment shader
            │       └── main.vert      # Vertex shader
            ├── ios                    # iOS compatibility layer
            │   ├── lazyImg            # Lazy image loading
            │   │   └── index.js       # Implementation
            │   └── lazyVideo          # Lazy video loading
            │       └── index.js       # Implementation
            ├── js                     # Core JavaScript logic
            │   └── page               # Page-specific logic
            │       ├── comps.js       # Component management
            │       ├── create.js      # Element creation
            │       ├── events.js      # Event handling
            │       ├── ios.js         # iOS compatibility
            │       ├── loads.js       # Asset loading
            │       ├── pagemain.js    # Main page functionality
            │       ├── scroll.js      # Scroll behavior
            │       └── showhide.js    # Visibility management
            ├── main                   # Main application logic
            │   ├── anims.js           # Animation management
            │   ├── events.js          # Global event handling
            │   ├── index.js           # Main entry point
            │   ├── pop.js             # Popup handling
            │   └── view.js            # View management
            ├── start                  # Initialization logic
            │   ├── browser.js         # Browser detection
            │   ├── constructor.js     # App construction
            │   └── firstload.js       # Initial loading
            └── views                  # View components
                ├── app.js             # Main application view
                ├── Home               # Home page view
                │   ├── 0Intro         # Home intro section
                │   │   └── index.js   # Implementation
                │   └── home.js        # Home page logic
                ├── Project            # Single project view
                │   ├── 0Intro         # Project intro
                │   │   ├── index.js   # Implementation
                │   │   └── ioin.js    # In-out animation
                │   └── project.js     # Project page logic
                ├── Projects           # Projects listing view
                │   ├── 0Intro         # Projects intro
                │   │   └── index.js   # Implementation
                │   └── projects.js    # Projects page logic
                ├── Error              # Error page view
                │   ├── 0Intro         # Error intro
                │   │   └── index.js   # Implementation
                │   └── error.js       # Error page logic
                ├── Playground         # Playground view
                │   └── playground.js  # Playground logic
                └── About              # About page view
                    ├── 0Intro         # About intro
                    │   └── index.js   # Implementation
                    ├── 1Dual          # Dual section
                    │   └── io.js      # In-out animation
                    └── about.js       # About page logic
```

#### Key Observations:

1. **Architecture Pattern:** 
   - Vanilla JS with manual DOM manipulation
   - WordPress-based content structure
   - Complex WebGL implementation for visual effects
   - Class-based component organization with side effects

2. **Interactive Elements:**
   - Custom mouse cursor
   - Page transitions and animations
   - WebGL-powered visual effects
   - Lazy-loaded images and videos

3. **CSS Implementation:**
   - Monolithic CSS file (index.css)
   - Heavy use of custom classes and animations
   - Complex selectors and specificity hierarchy

### New Project (Next.js)

The new project follows a modern React/Next.js architecture with App Router structure:

```
/Users/chrishall/development/next/nextgl
├── src
│   ├── app                            # Next.js App Router structure
│   │   ├── about                      # About page route
│   │   │   └── page.js                # About page component
│   │   ├── fonts.js                   # Font configuration
│   │   ├── globals.css                # Global CSS styles
│   │   ├── home                       # Home page route
│   │   │   └── page.js                # Home page component
│   │   ├── layout.js                  # Root layout
│   │   ├── not-found.js               # 404 page
│   │   ├── page.js                    # Root page (index)
│   │   ├── playground                 # Playground route
│   │   │   └── page.js                # Playground page component
│   │   ├── project                    # Project route
│   │   │   └── [slug]                 # Dynamic project route
│   │   │       └── page.js            # Project page component
│   │   └── projects                   # Projects listing route
│   │       └── page.js                # Projects page component
│   ├── assets
│   │   └── fonts                      # Font assets
│   ├── components                     # UI Components
│   │   ├── interface                  # User interface components
│   │   │   ├── Loader.jsx             # Loading screen
│   │   │   ├── Mouse.jsx              # Custom mouse cursor
│   │   │   ├── Nav.jsx                # Navigation
│   │   │   ├── NavBlur.jsx            # Navigation blur effect
│   │   │   └── PageTransition.jsx     # Page transition component
│   │   ├── lazy                       # Lazy loading components
│   │   │   ├── LazyImage.jsx          # Lazy image loading
│   │   │   └── LazyVideo.jsx          # Lazy video loading
│   │   ├── Renderer.jsx               # Main WebGL renderer
│   │   ├── views                      # View components
│   │   │   ├── AboutDual.jsx          # About dual section
│   │   │   ├── AboutIntro.jsx         # About intro section
│   │   │   ├── AboutView.jsx          # About view
│   │   │   ├── ErrorIntro.jsx         # Error intro section
│   │   │   ├── ErrorView.jsx          # Error view
│   │   │   ├── HomeIntro.jsx          # Home intro section
│   │   │   ├── HomeView.jsx           # Home view
│   │   │   ├── Playground.jsx         # Playground view
│   │   │   ├── ProjectIntro.jsx       # Project intro section
│   │   │   ├── ProjectIOIn.jsx        # Project in-out animation
│   │   │   ├── ProjectsIntro.jsx      # Projects intro section
│   │   │   ├── ProjectsView.jsx       # Projects view
│   │   │   └── ProjectView.jsx        # Project view
│   │   └── webgl                      # WebGL React components
│   │       ├── About.jsx              # About WebGL component
│   │       ├── Background.jsx         # Background WebGL component
│   │       ├── Base.jsx               # Base WebGL component
│   │       ├── Footer.jsx             # Footer WebGL component
│   │       ├── Loader.jsx             # Loader WebGL component
│   │       ├── Pg.jsx                 # Playground WebGL component
│   │       ├── Roll.jsx               # Roll WebGL component
│   │       ├── Slides.jsx             # Slides WebGL component
│   │       └── Title.jsx              # Title WebGL component
│   ├── context                        # React context providers
│   │   ├── AppContext.jsx             # App state context
│   │   ├── AppEventsContext.js        # Event system context
│   │   ├── AppProvider.jsx            # Context provider wrapper
│   │   ├── LenisContext.js            # Scroll context
│   │   ├── PageContext.js             # Page state context
│   │   └── WebGLContext.js            # WebGL state context
│   ├── hooks                          # Custom React hooks
│   │   ├── page                       # Page-related hooks
│   │   │   ├── useDynamicCreation.js  # Dynamic component creation
│   │   │   ├── useIOSObserver.js      # iOS observation
│   │   │   ├── usePageController.js   # Page controller
│   │   │   ├── usePageEvents.js       # Page events
│   │   │   ├── usePageLoader.js       # Page loading
│   │   │   ├── usePageScroll.js       # Page scrolling
│   │   │   └── useShowHide.js         # Element visibility
│   │   ├── useInitialData.js          # Initial data loading
│   │   ├── useIntersectionObserver.js # Intersection observation
│   │   ├── useLoader.js               # Loader state
│   │   ├── useLoadingEvents.js        # Loading events
│   │   ├── useMouse.js                # Mouse position tracking
│   │   ├── useNavClock.js             # Navigation clock
│   │   ├── usePageLifecycle.js        # Page lifecycle events
│   │   └── webgl                      # WebGL-related hooks
│   │       ├── useAbout.js            # About WebGL hook
│   │       ├── useBackground.js       # Background WebGL hook
│   │       ├── useBase.js             # Base WebGL hook
│   │       ├── useFooter.js           # Footer WebGL hook
│   │       ├── useLoader.js           # Loader WebGL hook
│   │       ├── usePg.js               # Playground WebGL hook
│   │       ├── useRoll.js             # Roll WebGL hook
│   │       ├── useSlides.js           # Slides WebGL hook
│   │       ├── useTitle.js            # Title WebGL hook
│   │       └── useWebglLoader.js      # WebGL loader hook
│   ├── lib                            # Utility libraries
│   │   ├── startup                    # Initialization logic
│   │   │   └── browserCheck.js        # Browser detection
│   │   └── utils                      # Helper utilities
│   │       ├── iosUtils.js            # iOS utilities
│   ├── styles                         # CSS modules (in progress)
│   └── webgl                          # WebGL implementation from legacy src/gl
│       ├── components                 # WebGL components
│       │   ├── About                  # WebGL About component
│       │   ├── Background             # WebGL Background component
│       │   ├── Base                   # WebGL Base component
│       │   ├── Footer                 # WebGL Footer component
│       │   ├── Loader                 # WebGL Loader component
│       │   ├── Pg                     # WebGL Playground component
│       │   ├── Roll                   # WebGL Roll component
│       │   ├── Slides                 # WebGL Slides component
│       │   └── Title                  # WebGL Title component
│       └── core                       # Core WebGL functionality
│           ├── WebGLContext.js        # React context for GL state
│           └── WebGLManager.js        # Low-level WebGL utilities
```

## Refactoring Approach

This project refactors a vanilla JavaScript portfolio site into a modern Next.js application. The refactoring uses a systematic component-based approach where each legacy feature is decomposed into multiple specialized React parts.

### Key Architectural Transformations

#### 1. Component Architecture

**Legacy Approach (Vanilla JS):**
- Monolithic components with direct DOM manipulation
- Global state and side effects
- Manual event handling and coordination

**New Approach (React/Next.js):**
- Functional React components with hooks
- React Context API for state management
- Declarative event handling
- Component composition for UI organization

#### 2. WebGL Implementation

**Legacy Approach:**
- Direct canvas manipulation
- Imperative WebGL calls
- Global state for WebGL context

**New Approach:**
- WebGL functionality abstracted behind React components
- Hooks for WebGL state management
- Shader integration with React lifecycle
- Declarative WebGL component usage

### Core Implementation Patterns

For each major feature, the refactoring follows consistent patterns:

#### UI Components

Each legacy UI component (Loader, Mouse, Nav) is refactored into:
- A React functional component
- Custom hooks for state management
- CSS modules for styling
- Proper React lifecycle integration

#### WebGL Components

Each legacy WebGL component is refactored into:
- WebGL implementation (`/webgl/components/[Component]/`)
- React component wrapper (`/components/webgl/[Component].jsx`)
- Custom hook for state (`/hooks/webgl/use[Component].js`)
- Integration with React context for coordination

#### Views and Routing

The views are refactored into:
- Next.js App Router pages
- React view components
- Intro/animation components
- Proper data fetching and routing

## Project Structure Mapping

### Legacy Structure:
```
/tmp/legacy-vanilla-js
├── index.html                         # Single HTML entry point
└── wp-content/themes
    ├── csskiller_wp
    │   └── index.css                  # Monolithic CSS
    └── src
        ├── components                 # UI Components
        ├── gl                         # WebGL Components
        ├── ios                        # iOS Compatibility
        ├── js                         # Core JavaScript
        ├── main                       # Main Application Logic
        ├── start                      # Initialization
        └── views                      # View Components
```

### New Structure:
```
/Users/chrishall/development/next/nextgl
├── src
│   ├── app                            # Next.js App Router
│   ├── components                     # React Components
│   │   ├── interface                  # UI Components
│   │   ├── lazy                       # Lazy Loading Components
│   │   ├── views                      # View Components
│   │   └── webgl                      # WebGL Component Wrappers
│   ├── context                        # React Context Providers
│   ├── hooks                          # React Hooks
│   │   ├── page                       # Page-related Hooks
│   │   └── webgl                      # WebGL-related Hooks
│   ├── lib                            # Utility Libraries
│   ├── styles                         # CSS Modules
│   └── webgl                          # WebGL Implementation
│       ├── components                 # WebGL Components
│       └── core                       # Core WebGL Functionality
```

## Detailed Component Mapping

### 1. UI Components

**Legacy:**
- `/components/Loader/index.js`
- `/components/Mouse/index.js`
- `/components/Nav/index.js`

**New:**
- `/components/interface/Loader.jsx`
- `/components/interface/Mouse.jsx`
- `/components/interface/Nav.jsx`
- `/hooks/useLoader.js`
- `/hooks/useMouse.js`
- `/hooks/useNavClock.js`

### 2. WebGL Components

**Legacy:**
- `/gl/[Component]/base.js`
- `/gl/[Component]/position.js`
- `/gl/[Component]/[shader files]`

**New:**
- `/webgl/components/[Component]/index.js`
- `/webgl/components/[Component]/geometry.js`
- `/webgl/components/[Component]/shaders/`
- `/components/webgl/[Component].jsx`
- `/hooks/webgl/use[Component].js`

### 3. Views

**Legacy:**
- `/views/[View]/[view].js`
- `/views/[View]/0Intro/index.js`

**New:**
- `/app/[view]/page.js`
- `/components/views/[View]View.jsx`
- `/components/views/[View]Intro.jsx`

## Implementation Priorities

Based on the analysis of both codebases and current progress, the following implementation priorities will guide the completion of the refactoring project.

### 1. Missing Critical Components

#### useSplitText Hook for Text Animations

The `useSplitText` hook is a critical missing piece that blocks proper text animations. This hook needs to replicate the functionality of the legacy `writeCt` function in `anims.js`.

**Implementation Plan:**

```jsx
// src/hooks/useSplitText.js
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

export const useSplitText = (elementRef, options = {}) => {
  const splitInstance = useRef(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Clear any existing split
    if (splitInstance.current?.revert) {
      splitInstance.current.revert();
    }
    
    // Determine the selection target
    const target = options.selector 
      ? elementRef.current.querySelectorAll(options.selector)
      : elementRef.current;
    
    // Create the text split
    splitInstance.current = new SplitType(target, {
      types: options.types || 'chars,words'
    });
    
    // Handle different animation types
    if (options.type === 'Atext' || options.type === 'Aline') {
      // Handle line animations
      const lines = elementRef.current.querySelectorAll('.line');
      lines.forEach((line, i) => {
        // Set animation delay parameter
        line.dataset.params = (i * 0.15).toString();
      });
    } 
    else if (options.processChars) {
      // Process characters for Awrite animations
      const chars = elementRef.current.querySelectorAll('.char');
      const fakes = '##·$%&/=€|()@+09*+]}{[';
      
      chars.forEach(char => {
        // Wrap original character
        const text = char.innerHTML;
        char.innerHTML = `<span class="n">${text}</span>`;
        
        // Add fake characters for animation
        for (let i = 0; i < (options.fakeCount || 2); i++) {
          const randIndex = Math.floor(Math.random() * fakes.length);
          const fakeChar = fakes[randIndex];
          char.insertAdjacentHTML('afterbegin', 
            `<span class="f" aria-hidden="true">${fakeChar}</span>`);
        }
      });
      
      // Set initial opacity for animation
      if (elementRef.current && !options.skipOpacity) {
        elementRef.current.style.opacity = '0';
      }
    }
    
    return () => {
      if (splitInstance.current?.revert) {
        splitInstance.current.revert();
      }
    };
  }, [elementRef, options]);
  
  return splitInstance;
};
```

#### Animation Context Implementation

A central animation context is needed to coordinate animations across components, replicating the event-based system in the legacy code.

**Implementation Plan:**

```jsx
// src/context/AnimationContext.jsx
import { createContext, useContext, useRef, useCallback } from 'react';
import gsap from 'gsap';

const AnimationContext = createContext({
  registerAnimation: () => {},
  triggerAnimation: () => {},
  createTimeline: () => {},
});

export const AnimationProvider = ({ children }) => {
  const animations = useRef(new Map());
  const timelines = useRef(new Map());
  
  // Register animation function with the context
  const registerAnimation = useCallback((id, animationFn) => {
    animations.current.set(id, animationFn);
    return () => animations.current.delete(id);
  }, []);
  
  // Trigger animation by ID or element
  const triggerAnimation = useCallback((target, state = 1, params = {}) => {
    if (typeof target === 'string') {
      // Trigger by ID
      const animFn = animations.current.get(target);
      if (animFn) animFn(state, params);
    } else if (target instanceof Element) {
      // Find selector-based animations that match the element
      for (const [id, animFn] of animations.current.entries()) {
        if (id.startsWith('selector:') && target.matches(id.substring(9))) {
          animFn(state, params);
        }
      }
    }
  }, []);
  
  // Create and manage GSAP timeline
  const createTimeline = useCallback((id, options = {}) => {
    // Kill existing timeline
    if (timelines.current.has(id)) {
      timelines.current.get(id).kill();
    }
    
    // Create new timeline
    const timeline = gsap.timeline({
      paused: true,
      ...options,
    });
    
    timelines.current.set(id, timeline);
    return timeline;
  }, []);
  
  return (
    <AnimationContext.Provider value={{ 
      registerAnimation, 
      triggerAnimation,
      createTimeline,
    }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
```

#### PCSS Module Completion

CSS modules need to be created for each component, starting with critical ones like navigation.

**Implementation Plan:**

```css
/* src/styles/components/nav.pcss */
.nav {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  padding: 24px 0;
  pointer-events: none;
  
  /* Variables */
  --light: #F8F6F2;
  --gray: #8A8A8A;
  --dark: #000;
}

.nav_blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  & > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: opacity 0.6s ease;
  }
}

.nav_top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.nav_left {
  display: flex;
  align-items: center;
  
  & .sep {
    width: 1px;
    height: 16px;
    background-color: var(--dark);
    margin: 0 16px;
  }
}

.nav_logo {
  font-size: 24px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.02em;
  pointer-events: auto;
}

.nav_clock {
  display: flex;
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
}

.nav_right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  & a {
    font-size: 16px;
    line-height: 1.2;
    margin-bottom: 8px;
    pointer-events: auto;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.nav_burger {
  display: none;
  width: 32px;
  height: 32px;
  position: relative;
  cursor: pointer;
  pointer-events: auto;
  
  & span {
    position: absolute;
    left: 4px;
    right: 4px;
    height: 2px;
    background-color: var(--dark);
    transition: transform 0.3s ease;
    
    &:nth-child(1) {
      top: 10px;
    }
    
    &:nth-child(2) {
      top: 16px;
    }
    
    &:nth-child(3) {
      top: 22px;
    }
  }
  
  @media (max-width: 768px) {
    display: block;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .nav_right_ops {
    display: none;
  }
  
  html.act-menu .nav_right_ops {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    padding: 24px;
    background-color: var(--light);
  }
}
```

#### WebGL Component Integration

WebGL components need proper integration with React lifecycle and state management.

**Implementation Plan:**

```jsx
// src/hooks/useWebGLComponent.js
import { useEffect, useRef } from 'react';
import { useWebGLContext } from '@/context/WebGLContext';

export const useWebGLComponent = (componentName, options = {}) => {
  const { registerComponent, updateComponent, removeComponent } = useWebGLContext();
  const instanceId = useRef(`${componentName}-${Math.random().toString(36).substring(2, 9)}`);
  
  useEffect(() => {
    // Register the component with the WebGL context
    registerComponent(instanceId.current, {
      name: componentName,
      ...options
    });
    
    return () => {
      // Clean up on unmount
      removeComponent(instanceId.current);
    };
  }, [componentName, registerComponent, removeComponent]);
  
  // Update component props
  useEffect(() => {
    updateComponent(instanceId.current, options);
  }, [updateComponent, options]);
  
  return instanceId.current;
};
```

### 2. Next Steps

#### Create Key Hooks for Animation System

1. **useTextAnimation Hook**

This hook will handle text animations based on the legacy `writeFn` function:

```jsx
// src/hooks/useTextAnimation.js
import { useEffect, useRef, useCallback } from 'react';
import { useAnimation } from '@/context/AnimationContext';
import gsap from 'gsap';

export const useTextAnimation = (ref, type = 'Awrite', options = {}) => {
  const { createTimeline, registerAnimation } = useAnimation();
  const timelineRef = useRef(null);
  const componentId = useRef(`text-anim-${Math.random().toString(36).substring(2, 9)}`);
  
  // Animation trigger function
  const triggerAnimation = useCallback((state = 1, params = {}) => {
    if (!ref.current) return;
    
    // Parse animation parameters
    const paramsStr = ref.current.dataset.params || '0,0';
    const defaultParams = paramsStr.split(',').map(parseFloat);
    const delay = params.delay !== undefined ? params.delay : defaultParams[0] || 0;
    
    // Create animation timeline
    timelineRef.current = createTimeline(componentId.current, {
      onComplete: () => {
        if (ref.current) ref.current.classList.add('ivi');
      }
    });
    
    if (state === 1) {
      // Forward animation
      if (type === 'Awrite') {
        // Character-by-character animation
        const chars = ref.current.querySelectorAll('.char');
        const times = [0.3, 0.05, 0.16, 0.05, 0.016]; // Animation timings
        
        // Set container visible
        timelineRef.current.set(ref.current, { opacity: 1 }, 0);
        
        // Animate each character
        chars.forEach((char, i) => {
          const n = char.querySelector('.n');
          timelineRef.current.to(n, {
            opacity: 1,
            duration: times[0],
            ease: 'power4.inOut'
          }, (i * times[1]) + delay);
          
          // Animate fake characters
          const fakes = char.querySelectorAll('.f');
          fakes.forEach((f, u) => {
            timelineRef.current
              .set(f, { opacity: 0, display: 'block' }, 0)
              .fromTo(f,
                { scaleX: 1, opacity: 1 },
                {
                  scaleX: 0,
                  opacity: 0,
                  duration: times[2],
                  ease: 'power4.inOut'
                },
                delay + ((i * times[3]) + ((1 + u) * times[4]))
              )
              .set(f, { display: 'none' }, '>');
          });
        });
      } else if (type === 'Atext' || type === 'Aline') {
        // Line-by-line animation
        const lines = ref.current.querySelectorAll('.line');
        
        timelineRef.current.set(ref.current, { opacity: 1 }, 0);
        
        lines.forEach((line, i) => {
          const lineDelay = line.dataset.params ? parseFloat(line.dataset.params) : i * 0.1;
          timelineRef.current.fromTo(line,
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.6,
              ease: 'power4.inOut'
            },
            lineDelay + delay
          );
        });
      }
      
      // Play the animation
      timelineRef.current.play();
    } else if (state === -1) {
      // Reverse animation
      if (timelineRef.current) {
        timelineRef.current.reverse();
      } else {
        // Create reverse animation if timeline doesn't exist
        timelineRef.current = createTimeline(componentId.current);
        
        if (type === 'Awrite') {
          const chars = [...ref.current.querySelectorAll('.char')].reverse();
          
          timelineRef.current.set(ref.current, { opacity: 1 }, 0);
          
          chars.forEach((char, i) => {
            timelineRef.current.to(char, {
              opacity: 0,
              duration: 0.2,
              ease: 'power4.inOut'
            }, i * 0.04);
          });
          
          timelineRef.current.to(ref.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power4.inOut'
          }, 0.4);
        } else {
          const lines = [...ref.current.querySelectorAll('.line')].reverse();
          
          lines.forEach((line, i) => {
            timelineRef.current.to(line, {
              opacity: 0,
              duration: 0.2,

## HTML Structure Analysis

The legacy codebase uses a complex HTML structure with specialized class naming patterns and deeply nested elements. Understanding this structure is critical for proper refactoring into React components.

### 1. Key Component Patterns

#### Navigation Component
```html
<nav class="nav">
  <div class="nav_blur">...</div>
  <div class="nav_top c-vw">
    <div class="nav_left">
      <a class="nav_logo Awrite actLink ivi">...</a>
      <div class="nav_clock">
        <div class="nav_clock_p Awrite ivi">...</div>
        <div class="nav_clock_h Awrite ivi">...</div>
        <div class="nav_clock_s">:</div>
        <div class="nav_clock_m Awrite ivi">...</div>
        <div class="nav_clock_a Awrite ivi">...</div>
      </div>
    </div>
    <div class="nav_right">
      <div class="nav_right_ops">
        <a class="Awrite ivi">...</a>
        <!-- More navigation links -->
      </div>
    </div>
  </div>
</nav>
```

#### WebGL Canvas Elements
```html
<canvas width="3062" height="1394" id="glBg"></canvas>
<canvas width="667" height="419" class="glF" data-temp="..."></canvas>
<canvas width="1210" height="907" class="glMedia"></canvas>
```

#### Content Structure
```html
<div id="content" data-template="home" data-id="2">
  <main class="home">
    <section class="home_hero">
      <div class="c-vw cnt">
        <!-- Content container -->
      </div>
    </section>
    <section class="home_prjs">
      <!-- Projects section -->
    </section>
  </main>
</div>
```

#### Project Item Structure
```html
<a class="cnt_prj cnt_prj-0 MW evt" href="..." data-tt="See more">
  <div class="cnt_prj_im">
    <div class="Oi" data-src="..." data-oi="3"></div>
    <video style="aspect-ratio:720/540" data-auto="true" data-src="..."></video>
    <canvas width="1210" height="907" class="glMedia"></canvas>
  </div>
  <div class="cnt_prj_t">
    <h3 class="Awrite">...</h3>
  </div>
</a>
```

### 2. Animation Class Patterns

#### Text Animation System
The codebase uses a sophisticated text animation system with several key classes:

1. **Awrite**: Core text animation class that splits text into characters for animated effects
   ```html
   <h4 class="Awrite inview stview ivi" data-params="1.6" style="opacity: 1;">
     <div class="word" style="display: inline-block;">
       <div class="char" style="display: inline-block; opacity: 1;">
         <span class="f" aria-hidden="true">...</span>
         <span class="f" aria-hidden="true">...</span>
         <span class="n" style="opacity: 1;">P</span>
       </div>
       <!-- More characters -->
     </div>
   </h4>
   ```

2. **Atitle**: Special title animation with WebGL integration
   ```html
   <div class="Atitle">
     <div class="cCover">
       <canvas width="667" height="419" class="glF"></canvas>
     </div>
     <div class="Oi Oi-tt" data-temp="tt" data-l="-0.022" data-m="5" data-text="Eva" data-oi="0"></div>
     <div class="ttj Oiel act">
       <div class="word">...</div>
     </div>
   </div>
   ```

3. **Animation State Classes**:
   - `ivi`: Visibility initialized
   - `act`: Active element
   - `inview`: Element in viewport
   - `stview`: Start view animation

#### Intersection Observer System
The codebase uses a custom intersection observer implementation:

```html
<div class="iO iO-std" data-io="2" style="visibility: visible;"></div>
```

These elements are used as triggers for animations when scrolled into view, identified by `data-io` attributes.

### 3. Element Hierarchy and Relationships

#### Naming Conventions
- `nav_*`: Navigation components
- `cnt_*`: Content container elements
- `home_*`: Home page specific sections
- `*_im`: Image containers
- `*_t`: Text containers
- `Oi-*`: Intersection observer elements
- `*el`: Element containers

#### Nesting Pattern
The legacy HTML follows a consistent nesting pattern:

1. Section container (`section.home_hero`)
2. Content container (`div.c-vw.cnt`) 
3. Content holder (`div.cnt_hold`)
4. Element groups (`div.cnt_t`, `div.cnt_ft`)
5. Individual elements (titles, text, links)

#### Data Attributes
Important data attributes used throughout:
- `data-template`: Page template identifier
- `data-id`: Element ID for JavaScript targeting
- `data-io`: Intersection observer target ID
- `data-oi`: WebGL observer ID
- `data-temp`: WebGL template type
- `data-text`: Original text content for animations
- `data-params`: Animation parameters
- `data-auto`: Autoplay for videos
- `data-src`: Source URL (lazy-loaded)

### 4. WebGL Integration Points

#### Canvas Categories
The codebase uses three distinct types of WebGL canvases:

1. **Background Canvas**: Full-page WebGL background
   ```html
   <canvas width="3062" height="1394" id="glBg"></canvas>
   ```

2. **Title Effects Canvas**: Used in title animations
   ```html
   <canvas width="667" height="419" class="glF" style="width: 333.984375px; height: 209.5px;"></canvas>
   ```

3. **Media Effect Canvas**: Applied to images and videos
   ```html
   <canvas width="1210" height="907" class="glMedia" style="width: 605.09375px; height: 453.8125px;"></canvas>
   ```

#### WebGL Data Configuration
Canvas elements are configured with specific data attributes:
- `data-temp`: Template type ("tt", "loader", etc.)
- `data-l`: Animation parameter (likely lerp value)
- `data-m`: Animation parameter (likely magnitude)
- `data-w`: Width parameter
- `data-s`: Scale parameter
- `data-text`: Text content to render

#### WebGL CSS Classes
- `glF`: WebGL foreground (text effects)
- `glMedia`: WebGL media effects (for images/videos)
- `glBg`: WebGL background effect
- `cCover`: Canvas container/wrapper

### 5. CSS Animation Integration

Multiple CSS animations are used alongside JavaScript and WebGL effects:

1. **Transition States**:
   - Elements have CSS transitions applied based on class changes
   - `opacity`, `transform` properties are animated

2. **Transform Manipulations**:
   - Text animation uses `scale`, `translate`, `rotate` transforms
   - Elements use `visibility` alongside `opacity` for better transitions

3. **Custom Properties**:
   - `--light`, `--gray`, `--dark` color variables
   - Inline styles for dynamic values

## Animation System Analysis and Implementation

One of the most complex systems to refactor is the animation system, particularly the text animations that give the site its distinctive feel. This section analyzes the legacy animation code and outlines a strategy for implementing it in React.

### 1. Legacy Animation Functions Analysis

The core of the animation system is in `src/main🐙🐙🐙/anims.js` with two main functions:

#### writeCt Function
This function prepares text elements for animation:

```javascript
export async function writeCt(el, l=2) {
  // Character set for fake letters
  let fakes = '##·$%&/=€|()@+09*+]}{['
  
  if(el.classList.contains('Atext')) {
    // Split multi-line text
    let spty = new window.SplitType(el.querySelectorAll('.Atext_el,p'), { types: 'lines' })
    // Process each line
    let splits = el.querySelectorAll('.line')
    for(let [i,a] of splits.entries()) {
      a.dataset.params = i * .15
      this.writeCt(a, 0)
    }
  } 
  else {
    // Split single-line text into characters
    new window.SplitType(el, { types: 'chars,words' })
    
    // Process each character
    let splits = el.querySelectorAll('.char')
    for(let [i,a] of splits.entries()) {
      // Wrap original character in .n span
      a.innerHTML = '<span class="n">'+a.innerHTML+'</span>'
      
      // Add fake characters
      for (let u=0; u<l; u++) {
        let rnd = this.getRnd(fakeslength)
        a.insertAdjacentHTML('afterbegin',
          '<span class="f" aria-hidden="true">'+fakes[rnd]+'</span>')
      }
    }
    // Initial opacity
    el.style.opacity = 0
  }
}
```

#### writeFn Function
This function controls the animation execution based on state:

```javascript
export async function writeFn(parent, state=0) {
  // State 0: Initialize
  if(state == 0) {
    this.writeCt(parent)
  }
  // State 1: Play animation
  else if(state == 1) {
    // Parse animation parameters
    let params = [0,3]
    if(parent.dataset.params) {
      params = parent.dataset.params.split(',')
      for(let i = 0; i<params.length; i++) {
        params[i]=parseFloat(params[i])
      }
    }
    
    // Different animation types
    if(parent.classList.contains('Atext')) {
      // Handle multi-line text animation
    }
    else if(parent.classList.contains('Aline')) {
      // Handle line animation
      let splits = parent.querySelectorAll('.line')
      let anim = gsap.timeline({
        paused: true,
        onComplete: () => { parent.classList.add('ivi') }
      })
      
      anim.set(parent, {opacity: 1}, 0)
      for(let [i,a] of splits.entries()) {
        anim.fromTo(a,
          {opacity: 0, yPercent: 50},
          {opacity: 1, duration: .6, yPercent: 0, ease: 'power4.inOut'},
          (i*.1)
        )
      }
      anim.play()
    }
    else {
      // Handle character animation (Awrite)
      let splits = parent.querySelectorAll('.char')
      let anim = gsap.timeline({
        paused: true,
        onComplete: () => { parent.classList.add('ivi') }
      })
      
      // Handle special cases
      if(parent.dataset.bucle) {
        // Loop animation configuration
      }
      
      // Set container opacity
      anim.set(parent, {opacity: 1}, 0)
      
      // Animation timing parameters
      let times = [.3, .05, .16, .05, .016]
      
      // Animate each character
      for(let [i,a] of splits.entries()) {
        let n = a.querySelector('.n')
        
        anim.set(a, {opacity: 1}, 0)
           .to(n, {
             opacity: 1, 
             duration: times[0], 
             ease: 'power4.inOut'
           }, (i*times[1]) + params[0])
        
        // Animate fake characters
        for(let [u,f] of a.querySelectorAll('.f').entries()) {
          anim.set(f, {opacity: 0, display: 'block'}, 0)
             .fromTo(f,
               {scaleX: 1, opacity: 1},
               {
                 scaleX: 0, 
                 opacity: 0, 
                 duration: times[2], 
                 ease: 'power4.inOut'
               },
               params[0] + ((i*times[3]) + ((1+u)*times[4]))
             )
             .set(f, {display: 'none'}, '>')
        }
      }
      
      // Play animation or set to end
      if(params[1] == -1) {
        anim.progress(1)
      } else {
        anim.play()
      }
    }
  }
  // State -1: Reverse animation
  else if(state == -1) {
    // Reverse animation logic...
  }
}
```

### 2. Text Animation System

The legacy system uses a class-based approach to control animations:

#### Animation Classes
- `Awrite`: Character-by-character typing effect with fake characters
- `Awrite-inv`: Inverted version with different entry animation
- `Atext`: Line-by-line text animation for paragraphs
- `Aline`: Line-based animation with simpler behavior

#### Character Structure
For `Awrite` animations, each character is structured as:

```html
<div class="char">
  <!-- Fake characters (usually 2) -->
  <span class="f" aria-hidden="true">#</span>
  <span class="f" aria-hidden="true">$</span>
  <!-- Actual character -->
  <span class="n">A</span>
</div>
```

The animation creates a "typing" effect by:
1. Showing fake characters briefly
2. Animating them away (using scaleX transition)
3. Revealing the actual character

#### State Classes
- `inview`: Element is in viewport (via Intersection Observer)
- `stview`: Animation should start
- `ivi`: Animation has completed
- `okF`: Flag for looping animations

### 3. React/GSAP Integration Strategy

To implement this system in React, we need a structured approach:

#### GSAP Integration
GSAP should be integrated with React's component lifecycle:

```jsx
// In hooks/useGSAP.js
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useAnimatedElement = () => {
  // Implementation details...
};
```

## Documentation Approach

This document will continue to be updated as the refactoring progresses to maintain an accurate record of:
- Component mapping between legacy and new code
- Architectural decisions and patterns
- Implementation progress and status

## Current Status and Completion Plan

This section outlines the current state of the refactoring project, identifies remaining work items, and provides a clear roadmap for completion.

### Current Status

Based on analysis of the codebase, here is the current completion status:

| System | Status | Description |
|--------|--------|-------------|
| WebGL Components | 80% | All 9 WebGL components have basic structure, but need integration |
| React Components | 70% | Most component shells created, but some are incomplete |
| Animation System | 40% | Basic animation hooks outlined, but text animation incomplete |
| CSS Modules | 30% | Basic structure created, but most modules need implementation |
| Routing | 90% | App Router structure complete, dynamic routes implemented |
| State Management | 60% | Context structure in place, but event system needs work |

### Missing Critical Components

1. **useSplitText Hook**
   - Currently missing
   - Required for text animation effects
   - Blocks proper Nav implementation

2. **CSS Modules**
   - nav.pcss and animation-related modules missing
   - Required for visual consistency

3. **Animation Context**
   - Needs more complete implementation
   - Required for coordinating animations

4. **WebGL Integration**
   - WebGL components created but not fully integrated with lifecycle

### Implementation Priorities

#### 1. Text Animation System (Highest Priority)

The text animation system is a key visual feature and dependency for multiple components. Implementation should follow this sequence:

1. Create useSplitText.js hook:
```javascript
// hooks/useSplitText.js
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

export const useSplitText = (elementRef, options = {}) => {
  const splitInstance = useRef(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Split text
    splitInstance.current = new SplitType(elementRef.current, {
      types: options.types || 'chars,words'
    });
    
    // Process for animation if requested
    if (options.processChars) {
      const chars = elementRef.current.querySelectorAll('.char');
      const fakes = '##·$%&/=€|()@+09*+]}{[';
      
      chars.forEach(char => {
        // Add character structure
        const text = char.innerHTML;
        char.innerHTML = `<span class="n">${text}</span>`;
        
        // Add fake characters for animation
        for (let i = 0; i < (options.fakeCount || 2); i++) {
          const randIndex = Math.floor(Math.random() * fakes.length);
          const fakeChar = fakes[randIndex];
          char.insertAdjacentHTML('afterbegin', 
            `<span class="f" aria-hidden="true">${fakeChar}</span>`);
        }
      });
      
      // Set initial opacity
      if (elementRef.current) elementRef.current.style.opacity = '0';
    }
    
    return () => {
      if (splitInstance.current?.revert) {
        splitInstance.current.revert();
      }
    };
  }, [elementRef, options]);
  
  return splitInstance;
};
```

2. Implement animation context for coordinating animations:
```javascript
// context/AnimationContext.jsx
import { createContext, useContext, useRef, useCallback } from 'react';

const AnimationContext = createContext({
  registerAnimation: () => {},
  triggerAnimation: () => {},
});

export const AnimationProvider = ({ children }) => {
  const animations = useRef(new Map());
  
  const registerAnimation = useCallback((id, animationFn) => {
    animations.current.set(id, animationFn);
    return () => animations.current.delete(id);
  }, []);
  
  const triggerAnimation = useCallback((id, state = 1) => {
    const animFn = animations.current.get(id);
    if (animFn) animFn(state);
  }, []);
  
  return (
    <AnimationContext.Provider value={{ registerAnimation, triggerAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
```

3. Create animation-related CSS modules

#### 2. Component Completion (High Priority)

Once the animation system is in place, complete these key components:

1. Nav.jsx - Navigation component with clock
2. PageTransition.jsx - Page transition animations
3. Title.jsx WebGL integration

#### 3. WebGL Integration (Medium Priority)

Focus on properly integrating WebGL with React lifecycle:

1. Complete WebGLContext implementation
2. Add proper cleanup and resource management
3. Ensure canvas resize handling
4. Connect with animation system

#### 4. CSS Migration (Medium Priority)

Continue migrating CSS to modular structure:

1. Complete component-specific modules
2. Implement animation-related styles
3. Ensure responsive behavior

### Testing Strategy

To ensure proper implementation, follow this testing approach:

1. **Component-by-Component Testing**
   - Test each component against legacy version
   - Verify visual appearance
   - Check interactive behavior

2. **Animation Testing**
   - Compare timing and easing with legacy
   - Ensure proper sequencing
   - Test on different devices

3. **Integration Testing**
   - Test full page flows
   - Verify transitions between pages
   - Check WebGL effects during navigation

### Implementation Timeline

| Phase | Timeframe | Focus |
|-------|-----------|-------|
| Phase 1 | Week 1-2 | Text animation system, Nav component |
| Phase 2 | Week 3-4 | WebGL integration, CSS modules |
| Phase 3 | Week 5-6 | Page transitions, view components |
| Phase 4 | Week 7-8 | Testing, optimization, bug fixes |

### Next Steps

1. Create useSplitText.js hook (highest priority)
2. Implement nav.pcss CSS module
3. Complete Nav.jsx component
4. Test basic text animation behavior

## Completion Strategy

This section outlines a focused strategy for completing the remaining refactoring work, with emphasis on critical missing components.

### 1. Critical Missing Hooks for Text Animation

The most important missing component is the `useSplitText` hook, which is blocking text animation functionality across multiple components:

#### useSplitText Hook Implementation 

```jsx
// src/hooks/useSplitText.js
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

export const useSplitText = (selector, options = {}) => {
  const splitRef = useRef(null);
  
  useEffect(() => {
    // If selector is a string, find matching elements
    const elements = typeof selector === 'string' 
      ? document.querySelectorAll(selector)
      : [selector.current];
      
    if (!elements.length) return;
    
    // Initialize split-type for each element
    elements.forEach(el => {
      if (!el) return;
      
      // Create split
      const split = new SplitType(el, {
        types: options.types || 'chars,words'
      });
      
      // Process characters if needed
      if (options.processChars) {
        const chars = el.querySelectorAll('.char');
        const fakes = '##·$%&/=€|()@+09*+]}{[';
        
        chars.forEach(char => {
          // Wrap original text in .n span
          const originalText = char.innerHTML;
          char.innerHTML = `<span class="n">${originalText}</span>`;
          
          // Add fake characters
          for (let i = 0; i < (options.fakeCount || 2); i++) {
            const randIndex = Math.floor(Math.random() * fakes.length);
            const fakeChar = fakes[randIndex];
            char.insertAdjacentHTML('afterbegin', 
              `<span class="f" aria-hidden="true">${fakeChar}</span>`);
          }
        });
        
        // Set initial opacity
        if (!options.skipInitialOpacity) {
          el.style.opacity = '0';
        }
      }
      
      splitRef.current = split;
    });
    
    return () => {
      if (splitRef.current?.revert) {
        splitRef.current.revert();
      }
    };
  }, [selector, options]);
  
  return splitRef.current;
};
```

**Implementation Plan:**
1. Create the `useSplitText.js` file in the `src/hooks` directory
2. Implement the hook as shown above
3. Add necessary dependencies (split-type) via `pnpm add split-type`
4. Test with a simple text element

#### useTextAnimation Hook

This hook will handle the animation logic for text elements:

```jsx
// src/hooks/useTextAnimation.js
import { useEffect, useRef, useCallback } from 'react';
import { useSplitText } from './useSplitText';
import gsap from 'gsap';

export const useTextAnimation = (ref, type = 'Awrite', options = {}) => {
  const timeline = useRef(null);
  const animationId = useRef(`text-anim-${Math.random().toString(36).substring(2, 9)}`);
  
  // Initialize text splitting
  const splitInstance = useSplitText(ref, {
    types: type === 'Awrite' ? 'chars,words' : 'lines',
    processChars: type === 'Awrite',
    fakeCount: options.fakeCount || 2,
    skipInitialOpacity: options.skipInitialOpacity
  });
  
  // Animation function
  const animate = useCallback((state = 1, params = {}) => {
    if (!ref.current) return;
    
    // Clear any existing animation
    if (timeline.current) {
      timeline.current.kill();
    }
    
    // Parse animation parameters
    const paramsData = ref.current.dataset.params || '0,0';
    const [delay = 0, flag = 0] = paramsData.split(',').map(parseFloat);
    
    // Create new timeline
    timeline.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (ref.current) {
          ref.current.classList.add('ivi');
        }
      }
    });
    
    if (state === 1) {
      // Forward animation
      if (type === 'Awrite') {
        // Character animation logic
        const chars = ref.current.querySelectorAll('.char');
        const times = [0.3, 0.05, 0.16, 0.05, 0.016]; // Timing constants
        
        // Make container visible
        timeline.current.set(ref.current, { opacity: 1 }, 0);
        
        // Animate each character
        chars.forEach((char, i) => {
          const n = char.querySelector('.n');
          
          // Show real character
          timeline.current.to(n, {
            opacity: 1,
            duration: times[0],
            ease: 'power4.inOut'
          }, (i * times[1]) + delay);
          
          // Animate fake characters
          const fakes = char.querySelectorAll('.f');
          fakes.forEach((f, u) => {
            timeline.current
              .set(f, { opacity: 0, display: 'block' }, 0)
              .fromTo(f,
                { scaleX: 1, opacity: 1 },
                {
                  scaleX: 0,
                  opacity: 0,
                  duration: times[2],
                  ease: 'power4.inOut'
                },
                delay + ((i * times[3]) + ((1 + u) * times[4]))
              )
              .set(f, { display: 'none' }, '>');
          });
        });
      } else if (type === 'Atext' || type === 'Aline') {
        // Line animation logic
        const lines = ref.current.querySelectorAll('.line');
        
        timeline.current.set(ref.current, { opacity: 1 }, 0);
        
        lines.forEach((line, i) => {
          timeline.current.fromTo(line,
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.6,
              ease: 'power4.inOut'
            },
            (i * 0.1) + delay
          );
        });
      }
      
      // Handle animation flags
      if (flag === -1) {
        // Set to end state immediately
        timeline.current.progress(1);
      } else {
        // Play the animation
        timeline.current.play();
      }
    } else if (state === -1) {
      // Reverse animation (hide element)
      if (type === 'Awrite') {
        const chars = [...ref.current.querySelectorAll('.char')].reverse();
        
        chars.forEach((char, i) => {
          timeline.current.to(char, {
            opacity: 0,
            duration: 0.2,
            ease: 'power4.inOut'
          }, i * 0.04);
        });
        
        timeline.current.to(ref.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power4.inOut'
        }, 0.4);
      } else {
        const lines = [...ref.current.querySelectorAll('.line')].reverse();
        
        lines.forEach((line, i) => {
          timeline.current.to(line, {
            opacity: 0,
            duration: 0.2,
            ease: 'power4.inOut'
          }, i * 0.04);
        });
        
        timeline.current.to(ref.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power4.inOut'
        }, 0.4);
      }
      
      timeline.current.play();
    }
    
    return timeline.current;
  }, [ref, type, options.fakeCount, options.skipInitialOpacity]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, []);
  
  return animate;
};
```

### 2. WebGL Integration Strategy

The refactoring includes 9 WebGL components, each with their own shaders and geometry. To properly integrate these with React, we need to:

#### WebGL Context Implementation

```jsx
// src/context/WebGLContext.jsx
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import WebGLManager from '@/webgl/core/WebGLManager';

const WebGLContext = createContext(null);

export const WebGLProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const manager = useRef(null);
  const componentsRef = useRef(new Map());
  
  // Initialize WebGL manager
  useEffect(() => {
    manager.current = new WebGLManager();
    setIsInitialized(true);
    
    return () => {
      // Clean up WebGL resources
      if (manager.current) {
        manager.current.dispose();
      }
    };
  }, []);
  
  // Register a WebGL component
  const registerComponent = useCallback((id, config) => {
    if (!manager.current) return;
    
    componentsRef.current.set(id, config);
    manager.current.createComponent(id, config);
    
    return () => {
      componentsRef.current.delete(id);
      manager.current.removeComponent(id);
    };
  }, []);
  
  // Update a component's props
  const updateComponent = useCallback((id, props) => {
    if (!manager.current || !componentsRef.current.has(id)) return;
    
    manager.current.updateComponent(id, props);
  }, []);
  
  // Remove a component
  const removeComponent = useCallback((id) => {
    if (!manager.current) return;
    
    componentsRef.current.delete(id);
    manager.current.removeComponent(id);
  }, []);
  
  // Resize handler
  const handleResize = useCallback(() => {
    if (manager.current) {
      manager.current.resize();
    }
  }, []);
  
  // Set up resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  
  const contextValue = {
    manager: manager.current,
    isInitialized,
    registerComponent,
    updateComponent,
    removeComponent
  };
  
  return (
    <WebGLContext.Provider value={contextValue}>
      {children}
    </WebGLContext.Provider>
  );
};

export const useWebGL = () => useContext(WebGLContext);
```

#### WebGL Component Hook Template

```jsx
// src/hooks/webgl/useWebGLComponent.js
import { useEffect, useRef } from 'react';
import { useWebGL } from '@/context/WebGLContext';

export const useWebGLComponent = (componentType, props = {}) => {
  const { registerComponent, updateComponent } = useWebGL();
  const componentId = useRef(`${componentType}-${Math.random().toString(36).substring(2, 9)}`);
  
  // Register component on mount
  useEffect(() => {
    if (!registerComponent) return;
    
    const cleanup = registerComponent(componentId.current, {
      type: componentType,
      ...props
    });
    
    return cleanup;
  }, [componentType, registerComponent]);
  
  // Update props when they change
  useEffect(() => {
    if (!updateComponent) return;
    
    updateComponent(componentId.current, props);
  }, [props, updateComponent]);
  
  return componentId.current;
};
```

### 3. Animation Context Implementation

To coordinate animations across components, we need a central animation context:

```jsx
// src/context/AnimationContext.jsx
import { createContext, useContext, useRef, useCallback } from 'react';

const AnimationContext = createContext({
  registerAnimation: () => {},
  triggerAnimation: () => {},
});

export const AnimationProvider = ({ children }) => {
  const animations = useRef(new Map());
  
  // Register an animation function
  const registerAnimation = useCallback((id, animationFn) => {
    animations.current.set(id, animationFn);
    return () => animations.current.delete(id);
  }, []);
  
  // Trigger animation by ID or element
  const triggerAnimation = useCallback((target, state = 1, params = {}) => {
    if (typeof target === 'string') {
      // Trigger by ID
      const animFn = animations.current.get(target);
      if (animFn) animFn(state, params);
    } else if (target instanceof Element) {
      // Find animations that match this element (slower)
      animations.current.forEach((animFn, id) => {
        if (id.startsWith('selector:') && target.matches(id.substring(9))) {
          animFn(state, params);
        }
      });
    }
  }, []);
  
  return (
    <AnimationContext.Provider value={{ registerAnimation, triggerAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
```

### 4. Component Priorities and Timeline

Based on the current status and dependencies, here's a prioritized timeline for completing the refactoring:

#### Week 1: Core Animation System (Highest Priority)

| Day | Task | Details |
|-----|------|---------|
| 1 | Create useSplitText hook | Implement split-text logic with fake character generation |
| 1 | Create useTextAnimation hook | Implement animation timeline for text effects |
| 2 | Implement Animation Context | Create context for coordinating animations |
| 2-3 | Implement nav.pcss module | Create CSS module for navigation styling |
| 3-4 | Complete Nav.jsx component | Wire up with animation hooks, implement clock |
| 5 | Test basic text animations | Verify character/line animations work properly |

#### Week 2: WebGL Integration (High Priority)

| Day | Task | Details |
|-----|------|---------|
| 1-2 | Finalize WebGLContext | Complete context implementation and manager |
| 2-3 | Implement WebGL component hooks | Create/update hooks for all 9 components |
| 3-4 | Test WebGL components | Verify rendering and shader behavior |
| 4-5 | Integrate with animation system | Connect WebGL animations with React lifecycle |

## Directory Structure Mapping and Implementation Status

This section provides a detailed mapping between legacy components and their Next.js counterparts, showing completion status and identifying critical missing pieces.

### 1. UI Components

| Legacy Component | Next.js Component | Status | Missing Pieces |
|------------------|-------------------|--------|---------------|
| `components/Loader/index.js` | `components/interface/Loader.jsx`<br>`hooks/useLoader.js` | 🟡 70% | Animation integration |
| `components/Mouse/index.js` | `components/interface/Mouse.jsx`<br>`hooks/useMouse.js` | 🟢 90% | Fine-tuning interactions |
| `components/Nav/index.js` | `components/interface/Nav.jsx`<br>`hooks/useNavClock.js` | 🔴 40% | Missing split-text animation<br>Missing nav.pcss |

### 2. WebGL Components

| Legacy Component | Next.js Component | Status | Missing Pieces |
|------------------|-------------------|--------|---------------|
| `gl/Loader/` | `webgl/components/Loader/`<br>`components/webgl/Loader.jsx`<br>`hooks/webgl/useLoader.js` | 🟡 70% | Integration with React lifecycle |
| `gl/Background/` | `webgl/components/Background/`<br>`components/webgl/Background.jsx`<br>`hooks/webgl/useBackground.js` | 🟡 80% | Event handling |
| `gl/Title/` | `webgl/components/Title/`<br>`components/webgl/Title.jsx`<br>`hooks/webgl/useTitle.js` | 🟡 75% | Text rendering configuration |
| `gl/Footer/` | `webgl/components/Footer/`<br>`components/webgl/Footer.jsx`<br>`hooks/webgl/useFooter.js` | 🟡 75% | Animation coordination |
| `gl/Roll/` | `webgl/components/Roll/`<br>`components/webgl/Roll.jsx`<br>`hooks/webgl/useRoll.js` | 🟡 80% | Performance optimization |
| `gl/About/` | `webgl/components/About/`<br>`components/webgl/About.jsx`<br>`hooks/webgl/useAbout.js` | 🟡 70% | MSDF text rendering |
| `gl/Base/` | `webgl/components/Base/`<br>`components/webgl/Base.jsx`<br>`hooks/webgl/useBase.js` | 🟡 75% | Shader parameter binding |
| `gl/Slides/` | `webgl/components/Slides/`<br>`components/webgl/Slides.jsx`<br>`hooks/webgl/useSlides.js` | 🟡 70% | Animation sequence |
| `gl/Pg/` | `webgl/components/Pg/`<br>`components/webgl/Pg.jsx`<br>`hooks/webgl/usePg.js` | 🟡 65% | Interactive behavior |

### 3. Context Providers

| Legacy Module | Next.js Module | Status | Missing Pieces |
|---------------|---------------|--------|---------------|
| `main/events.js` | `context/AppEventsContext.js`<br>`context/AppProvider.jsx` | 🟡 80% | Event sequence coordination |
| `gl/gl.js` | `context/WebGLContext.js` | 🟡 70% | Component registration system |
| N/A | `context/AnimationContext.jsx` | 🔴 0% | **Not implemented yet** |

### 4. Hooks

| Legacy Function | Next.js Hook | Status | Missing Pieces |
|-----------------|--------------|--------|---------------|
| `anims.js:writeCt()` | `hooks/useSplitText.js` | 🔴 0% | **Critical: Not implemented** |
| `anims.js:writeFn()` | `hooks/useTextAnimation.js` | 🔴 0% | **Critical: Not implemented** |
| `page/scroll.js` | `hooks/page/usePageScroll.js` | 🟢 90% | Minor refinements |
| `page/showhide.js` | `hooks/page/useShowHide.js` | 🟢 85% | State persistence |
| `ios/lazyImg/index.js` | Lazy-loading components | 🟢 95% | Minimal adjustments |

### 5. View Components

| Legacy View | Next.js View | Status | Missing Pieces |
|-------------|--------------|--------|---------------|
| `views/Home/` | `app/home/page.js`<br>`components/views/HomeView.jsx`<br>`components/views/HomeIntro.jsx` | 🟡 75% | Animation integration |
| `views/About/` | `app/about/page.js`<br>`components/views/AboutView.jsx`<br>`components/views/AboutIntro.jsx`<br>`components/views/AboutDual.jsx` | 🟡 70% | Integration with WebGL |
| `views/Project/` | `app/project/[slug]/page.js`<br>`components/views/ProjectView.jsx`<br>`components/views/ProjectIntro.jsx` | 🟡 65% | Dynamic content loading |
| `views/Projects/` | `app/projects/page.js`<br>`components/views/ProjectsView.jsx`<br>`components/views/ProjectsIntro.jsx` | 🟡 70% | Grid layout implementation |
| `views/Error/` | `app/not-found.js`<br>`components/views/ErrorView.jsx`<br>`components/views/ErrorIntro.jsx` | 🟡 80% | Error state handling |
| `views/Playground/` | `app/playground/page.js`<br>`components/views/Playground.jsx` | 🟡 60% | Interactive features |

### 6. CSS Modules

| Legacy CSS | Next.js CSS Module | Status | Missing Pieces |
|------------|-------------------|--------|---------------|
| Navigation styles | `styles/components/nav.pcss` | 🔴 0% | **Not implemented yet** |
| Typography | `styles/base/typography.pcss` | 🟡 50% | Responsive styles |
| Layout | `styles/layout/grid.pcss` | 🟡 40% | Container queries |
| Animations | `styles/abstract/animations.pcss` | 🔴 20% | Most animation styles missing |

### 7. Critical Missing Components

1. **Text Animation System**
   - `useSplitText` hook ⚠️ **Highest Priority**
   - `useTextAnimation` hook
   - `AnimationContext` for coordinating animations

2. **CSS Modules**
   - `nav.pcss` - Navigation styling
   - `animations.pcss` - Core animation classes

3. **Integration Components**
   - Complete integration between React components and WebGL
   - Page transition system

### 8. Next Steps by Priority

#### Immediate (This Week)

1. **Create useSplitText.js hook**
   ```jsx
   // src/hooks/useSplitText.js
   import { useEffect, useRef } from 'react';
   import SplitType from 'split-type';

   export const useSplitText = (ref, options = {}) => {
     // Implementation details as per the earlier section in this document
   };
   ```

2. **Create nav.pcss module**
   ```css
   /* src/styles/components/nav.pcss */
   .nav {
     position: fixed;
     z-index: 100;
     /* Rest of implementation as per earlier section */
   }
   ```

3. **Complete AnimationContext implementation**
   ```jsx
   // src/context/AnimationContext.jsx
   import { createContext, useContext, useRef, useCallback } from 'react';

   const AnimationContext = createContext({
     // Implementation details as per earlier section
   });
   ```

#### Short-term (Next 2 Weeks)

1. Complete `Nav.jsx` component with animation integration
2. Finalize WebGL context and component registration
3. Create essential CSS modules for components
4. Implement page transition system

#### Medium-term (2-4 Weeks)

1. Complete all view components
2. Optimize WebGL rendering
3. Implement responsive design system
4. Create comprehensive testing plan

### 9. Implementation Examples for Critical Components

#### useSplitText Hook

```jsx
// src/hooks/useSplitText.js
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

export const useSplitText = (elementRef, options = {}) => {
  // See implementation in section 1 above
};
```

#### AnimationContext

```jsx
// src/context/AnimationContext.jsx
import { createContext, useContext, useRef, useCallback } from 'react';

const AnimationContext = createContext({
  // See implementation in section 3 above
});
```

This mapping provides a clear picture of the current state of the refactoring project and identifies the critical components that need implementation. It also provides a prioritized roadmap for completing the remaining work.
};
```

#### Animation Context
Create a central animation context to manage animations:

```jsx
// In context/AnimationContext.jsx
import { createContext, useContext, useRef, useCallback } from 'react';

const AnimationContext = createContext({
  registerAnimation: () => {},
  triggerAnimation: () => {},
});

export const AnimationProvider = ({ children }) => {
  const animations = useRef(new Map());
  
  const registerAnimation = useCallback((id, animationFn) => {
    animations.current.set(id, animationFn);
    return () => animations.current.delete(id);
  }, []);
  
  const triggerAnimation = useCallback((id, state = 1) => {
    const animFn = animations.current.get(id);
    if (animFn) animFn(state);
  }, []);
  
  return (
    <AnimationContext.Provider value={{ registerAnimation, triggerAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
```

#### Text Splitting Hook
Implement a hook to handle text splitting:

```jsx
// In hooks/useSplitText.js
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

export const useSplitText = (ref, options = {}) => {
  const splitInstance = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Create split text
    splitInstance.current = new SplitType(ref.current, {
      types: options.types || 'chars,words'
    });
    
    // Process for Awrite animation
    if (options.type === 'Awrite') {
      const chars = ref.current.querySelectorAll('.char');
      const fakes = '##·$%&/=€|()@+09*+]}{[';
      
      chars.forEach(char => {
        // Setup character structure
        const text = char.innerHTML;
        char.innerHTML = `<span class="n">${text}</span>`;
        
        // Add fake characters
        for (let i = 0; i < (options.fakeCount || 2); i++) {
          const randIndex = Math.floor(Math.random() * fakes.length);
          const fakeChar = fakes[randIndex];
          char.insertAdjacentHTML('afterbegin', 
            `<span class="f" aria-hidden="true">${fakeChar}</span>`);
        }
      });
      
      // Set initial opacity
      if (ref.current) ref.current.style.opacity = '0';
    }
    
    return () => {
      if (splitInstance.current?.revert) {
        splitInstance.current.revert();
      }
    };
  }, [ref, options]);
  
  return splitInstance;
};
```

### 4. Animation Hooks Structure

Based on the legacy code, we need to implement these hooks:

#### useWriteAnimation

```jsx
// In hooks/useWriteAnimation.js
import { useEffect, useRef, useCallback } from 'react';
import { useAnimation } from '@/context/AnimationContext';
import { useSplitText } from './useSplitText';
import { useGSAP } from './useGSAP';
import gsap from 'gsap';

export const useWriteAnimation = (ref, type = 'Awrite', options = {}) => {
  const timeline = useRef(null);
  const { registerAnimation } = useAnimation();
  const elementId = useRef(`anim-${Math.random().toString(36).substr(2, 9)}`);
  
  // Setup text splitting
  useSplitText(ref, {
    types: type === 'Awrite' ? 'chars,words' : 'lines',
    type,
    fakeCount: options.fakeCount || 2
  });
  
  // Animation trigger function
  const triggerAnimation = useCallback((state = 1) => {
    if (!ref.current) return;
    
    // Kill any existing animation
    if (timeline.current) {
      gsap.killTweensOf(timeline.current);
    }
    
    // Parse animation parameters
    const paramsStr = ref.current.dataset.params || '0,0';
    const params = paramsStr.split(',').map(parseFloat);
    
    // Create new timeline
    timeline.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (ref.current) ref.current.classList.add('ivi');
      }
    });
    
    // Different animation based on type
    if (state === 1) {
      if (type === 'Awrite') {
        // Character animation
        const splits = ref.current.querySelectorAll('.char');
        const times = [0.3, 0.05, 0.16, 0.05, 0.016];
        
        // Set container visible
        timeline.current.set(ref.current, { opacity: 1 }, 0);
        
        // Animate each character
        splits.forEach((char, i) => {
          const n = char.querySelector('.n');
          
          timeline.current
            .set(char, { opacity: 1 }, 0)
            .to(n, {
              opacity: 1,
              duration: times[0],
              ease: 'power4.inOut'
            }, (i * times[1]) + params[0]);
          
          // Animate fake characters
          const fakes = char.querySelectorAll('.f');
          fakes.forEach((f, u) => {
            timeline.current
              .set(f, { opacity: 0, display: 'block' }, 0)
              .fromTo(f,
                { scaleX: 1, opacity: 1 },
                {
                  scaleX: 0,
                  opacity: 0,
                  duration: times[2],
                  ease: 'power4.inOut'
                },
                params[0] + ((i * times[3]) + ((1 + u) * times[4]))
              )
              .set(f, { display: 'none' }, '>');
          });
        });
      } else if (type === 'Atext' || type === 'Aline') {
        // Line animation
        const lines = ref.current.querySelectorAll('.line');
        
        timeline.current.set(ref.current, { opacity: 1 }, 0);
        
        lines.forEach((line, i) => {
          timeline.current.fromTo(line,
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.6,
              ease: 'power4.inOut'
            },
            (i * 0.1) + params[0]
          );
        });
      }
      
      // Play or set to end
      if (params[1] === -1) {
        timeline.current.progress(1);
      } else {
        timeline.current.play();
      }
    } else if (state === -1) {
      // Reverse animation implementation
      // ...
    }
  }, [ref, type]);
  
  // Register with animation context
  useEffect(() => {
    return registerAnimation(elementId.current, triggerAnimation);
  }, [registerAnimation, triggerAnimation]);
  
  return triggerAnimation;
};
```

#### useAnimatedElement

```jsx
// In hooks/useAnimatedElement.js
import { useRef, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import { useWriteAnimation } from './useWriteAnimation';

export

├── eslint.config.mjs
├── jsconfig.json
├── next.config.js
├── nextgl.code-workspace
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── public
│   ├── assets
│   │   └── fonts
│   │       ├── charset.txt
│   │       ├── PPAir-Medium-msdf.png
│   │       ├── PPAir-Medium.json
│   │       ├── PPNeueMontreal-Medium-msdf.png
│   │       └── PPNeueMontreal-Medium.json
│   ├── fonts
│   │   ├── PPAir-Medium.woff
│   │   ├── PPAir-Medium.woff2
│   │   ├── PPNeueMontreal-Medium.woff
│   │   ├── PPNeueMontreal-Medium.woff2
│   │   ├── PPNeueMontrealMono-Book.woff
│   │   └── PPNeueMontrealMono-Book.woff2
│   ├── next.svg
│   ├── placeholder.txt
│   ├── robots.txt
│   ├── site.webmanifest
│   └── vercel.svg
├── README.md
├── REFACTOR_LOG.md
└── src
    ├── app
    │   ├── about
    │   │   └── page.js
    │   ├── fonts.js
    │   ├── globals.css
    │   ├── home
    │   │   └── page.js
    │   ├── layout.js
    │   ├── not-found.js
    │   ├── page.js
    │   ├── playground
    │   │   └── page.js
    │   ├── project
    │   │   └── [slug]
    │   │       └── page.js
    │   └── projects
    │       └── page.js
    ├── components
    │   ├── interface # UI components from components🦾🦾🦾
    │   │   ├── Loader.jsx
    │   │   ├── Mouse.jsx
    │   │   ├── Nav.jsx
    │   │   ├── NavBlur.jsx ### May not be necessary or correct ###
    │   │   └── PageTransition.jsx
    │   ├── lazy # from ios⛓️⛓️⛓️
    │   │   ├── LazyImage.jsx
    │   │   └── LazyVideo.jsx
    │   ├── Renderer.jsx ### may no longer be needed ###
    │   ├── views # views👁️👁️👁
    │   │   ├── AboutDual.jsx # 🟢About
    │   │   ├── AboutIntro.jsx
    │   │   ├── AboutView.jsx
    │   │   ├── ErrorIntro.jsx # 🚫Error
    │   │   ├── ErrorView.jsx
    │   │   ├── HomeIntro.jsx # ⚪Home
    │   │   ├── HomeView.jsx
    │   │   ├── Playground.jsx # 🟡Playground
    │   │   ├── ProjectIntro.jsx # 🔵Project
    │   │   ├── ProjectIOIn.jsx
    │   │   ├── ProjectsIntro.jsx
    │   │   ├── ProjectsView.jsx # 🔵🔵🔵Project
    │   │   └── ProjectView.jsx
    │   └── webgl
    │       ├── About.jsx
    │       ├── Background.jsx
    │       ├── Base.jsx
    │       ├── Footer.jsx
    │       ├── Loader.jsx
    │       ├── Pg.jsx
    │       ├── Roll.jsx
    │       ├── Slides.jsx
    │       └── Title.jsx
    ├── context
    │   ├── AppContext.jsx
    │   ├── AppEventsContext.js # React.Context + emitter for “domReady” & “glReady” 
    │   ├── AppProvider.jsx  # wraps children in AppEventsContext.Provider
    │   ├── LenisContext.js
    │   └── WebGLContext.js # provides WebGL canvas & manager
    ├── hooks
    │   ├── page # hooks for js🧠🧠🧠/page👁️
    │   │   ├── useDynamicCreation.js # page properties from create.js
    │   │   ├── useIOSObserver.js # from ios.js
    │   │   ├── usePageController.js #  pulls page logic + WebGLContext
    │   │   ├── usePageEvents.js # resize, scroll, wheel, touch handlers
    │   │   ├── usePageLoader.js ### may be incorrect or no longer needed ###
    │   │   ├── usePageScroll.js
    │   │   └── useShowHide.js
    │   ├── useInitialData.js # from start🏁🏁🏁/firstload📊.js
    │   ├── useIntersectionObserver.js # webgl intersection observer
    │   ├── useLoader.js # UI Loader⏳ hook
    │   ├── useLoadingEvents.js # coordinates events from src/gl🌊🌊🌊/events.js
    │   ├── useMouse.js # UI Mouse🐭 hook
    │   ├── useNavClock.js # UI Nav🌤️ hook
    │   ├── usePageLifecycle.js ### may no longer be needed or accurate ###
    │   └── webgl #
    │       ├── useAbout.js
    │       ├── useBackground.js
    │       ├── useBase.js
    │       ├── useFooter.js
    │       ├── useLoader.js
    │       ├── usePg.js
    │       ├── useRoll.js
    │       ├── useSlides.js
    │       ├── useTitle.js
    │       └── useWebglLoader.js # canvas initialization and shader loading
    ├── lib # u
    │   ├── startup
    │   │   └── browserCheck.js # from start🏁🏁🏁/browser🕸️.js
    │   └── utils
    │       ├── iosUtils.js
    ├── styles # from index.css
    │   └── # pcss structure (in progress)
    └── webgl # webgl from gl🌊🌊🌊 
        ├── components
        │   ├── About # from 👩‍⚖️
        │   │   ├── geometry.js # position
        │   │   ├── index.js # base.js
        │   │   └── shaders
        │   │       ├── msdf.frag.glsl # '.frag' from '🧪.[shader].glsl 
        │   │       ├── msdf.vert.glsl # '.vert' from 🩻.[shader].glsl
        │   │       └── parent.frag.glsl
        │   ├── Background # 🏜️
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   └── shaders
        │   │       ├── main.frag.glsl
        │   │       └── main.vert.glsl
        │   ├── Base # 🖼️
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   └── shaders
        │   │       ├── main.frag.glsl
        │   │       └── main.vert.glsl
        │   ├── Footer # 🔥
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   └── shaders
        │   │       ├── msdf.frag.glsl
        │   │       ├── msdf.vert.glsl
        │   │       └── parent.frag.glsl
        │   ├── Loader #⌛️
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   └── shaders
        │   │       ├── main.frag.glsl
        │   │       └── main.vert.glsl
        │   ├── Pg # 🧮
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   ├── Pg.js
        │   │   └── shaders
        │   │       ├── main.frag.glsl
        │   │       └── main.vert.glsl
        │   ├── Roll # 🎢
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   └── shaders
        │   │       ├── single.frag.glsl
        │   │       └── single.vert.glsl
        │   ├── Slides # (🎞️
        │   │   ├── geometry.js
        │   │   ├── index.js
        │   │   └── shaders
        │   │       ├── main.frag.glsl
        │   │       ├── main.vert.glsl
        │   │       └── parent.frag.glsl
        │   └── Title # 💬
        │       ├── geometry.js
        │       ├── index.js
        │       └── shaders
        │           ├── msdf.frag.glsl
        │           └── msdf.vert.glsl
        └── core
            ├── WebGLContext.js # React context for GL state
            └── WebGLManager.js # low-level WebGL utilities