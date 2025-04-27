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
│   │   ├── api                        # API utilities
│   │   │   └── loadOptions.js         # Loading options
│   │   ├── startup                    # Initialization logic
│   │   │   └── browserCheck.js        # Browser detection
│   │   └── utils                      # Helper utilities
│   │       ├── iosUtils.js            # iOS utilities
│   │       └── loaders.js             # Loader utilities
│   ├── styles                         # CSS modules
│   │   ├── abstract                   # Variables, mixins, etc.
│   │   ├──

