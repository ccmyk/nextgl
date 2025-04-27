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

## Next Steps

1. **Complete Core Functionality**
   - Finalize missing hooks
   - Complete CSS module implementation
   - Ensure all components work together

2. **Enhance Integration**
   - Verify WebGL components function correctly
   - Implement complete animation system
   - Ensure proper page transitions

3. **Testing and Optimization**
   - Compare with legacy implementation
   - Optimize performance
   - Test across devices and browsers

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

export const useGSAP = (callback, deps = []) => {
  const ctx = useRef(gsap.context(() => {}));
  
  useEffect(() => {
    ctx.current.kill();
    ctx.current = gsap.context(callback);
    
    return () => ctx.current.revert();
  }, deps);
  
  return ctx;
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