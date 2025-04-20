# NextGL Project Status Documentation

## 1. Project Overview

NextGL is a modern web application built with:
- **Next.js 14.1.0** with WebGL integration through the OGL library
- **React 18.2.0** with an extensive system of custom hooks and context providers
- **Advanced Animation Systems** leveraging GSAP for animations and Lenis for smooth scrolling
- **Custom WebGL Components** with handcrafted GLSL shaders for immersive visual experiences

The project combines cutting-edge web technologies to deliver a performant, visually striking application with fluid transitions and interactive 3D elements.

## 2. Current Implementation

### WebGL Structure
- Organized under `src/components/webgl/` with specialized components:
  - Background, Base, Loader, Roll, Slides, Title, About, Footer, Pg
  - Each component has dedicated shader files (.glsl, .frag, .vert)
  - WebGLManager.js coordinates the rendering pipeline

### Page Components
- Modern Next.js App Router structure in `src/app/`:
  - Home: Main landing experience
  - About: Company/project information
  - Projects: Portfolio showcase
  - Project: Detailed view for individual projects
  - Playground: Interactive demonstrations

### Animation System
- Custom animation hooks (useAnimationLoop, useTextAnimation, etc.)
- WebGL context-based rendering with synchronized animations
- Intersection observers for scroll-based animations
- Custom scroll management with Lenis integration

### State Management
- Context providers (AppProvider, LenisProvider, WebGLContext)
- Component-specific state hooks (useTitleState, useBaseState, etc.)
- Timeline management for complex animation sequences

### Routing & Transitions
- Advanced page transitions using custom hooks
- Animation-synchronized navigation
- View transitions with WebGL integration

## 3. Technical Infrastructure

### Webpack Configuration
- Custom loaders for shader files (.glsl, .frag, .vert)
- SVG imports handled via @svgr/webpack
- Path aliases for simplified imports (@ resolves to src/)

### Performance Optimization
- Bundle splitting strategy:
  - Vendor code separation
  - Chunk optimization for reusable components
  - Minimum chunks of 2 for code sharing
- Server Components with external packages configuration

### CSS Architecture
- PostCSS with:
  - Nesting capabilities
  - Custom imports
  - Environment preset
  - Percentage CSS (PCSS) implementation

### Cross-Origin Configuration
- CORS headers for WebGL assets
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Embedder-Policy: require-corp

### Module Resolution
- @ imports resolve to src directory
- Optimized path resolution for faster builds

## 4. Recent Changes (Git History)

- **React, WebGL, Hook Updates** (latest commit)
  - Enhanced React integration with WebGL
  - Refined custom hooks for animation and state management
  - Performance improvements in WebGL rendering

- **PCSS and Context Updates**
  - Implementation of Percentage CSS for flexible styling
  - Context API refinements for better state management
  - Styling system improvements

- **OGL and Event Management**
  - Updates to the OGL library integration
  - Enhanced event handling system
  - Performance optimizations for WebGL components

- **Core Infrastructure Refactoring**
  - Modernized component architecture
  - Improved state management patterns
  - Enhanced reusability of core components

## 5. Current Status

- **Clean Working Tree**
  - All changes have been committed to version control
  - Branch is up-to-date with origin/main

- **Production-Ready Configuration**
  - Build pipeline configured for production deployment
  - Optimization features enabled (CSS optimization, scroll restoration)
  - CORS headers properly configured for WebGL assets

- **Component Organization**
  - Clear separation of concerns between components
  - Logical directory structure
  - Reusable component patterns

- **Styling System**
  - Comprehensive PostCSS setup
  - Well-organized stylesheets with proper abstractions
  - Responsive design patterns

## 6. Deployment Preparation Steps

1. **Run Final Linting**
   ```bash
   npm run lint
   ```
   or
   ```bash
   pnpm lint
   ```
   Ensure all code follows the project's style guidelines.

2. **Build for Production**
   ```bash
   npm run build
   ```
   or
   ```bash
   pnpm build
   ```
   Generate optimized production assets.

3. **Test Production Build Locally**
   ```bash
   npm run start
   ```
   or
   ```bash
   pnpm start
   ```
   Verify the application works as expected in production mode.

4. **Verify WebGL Components**
   - Ensure all WebGL components render correctly
   - Check for any WebGL-specific issues that might occur in production

5. **Cross-Browser Testing**
   - Test in Chrome, Firefox, Safari, and Edge
   - Verify mobile compatibility
   - Check for any browser-specific rendering issues

6. **Deploy to Production**
   - Upload build artifacts to production server
   - Configure server environment variables
   - Set up appropriate caching headers
   - Ensure CORS is properly configured for WebGL resources

## 7. Key Files and Directories

- **src/app**: Next.js 13+ App Router structure
  - Page components organized by route
  - Layout components for shared UI elements

- **src/components**: Reusable React components
  - Interface components for UI elements
  - WebGL components for 3D rendering
  - Media components for image and video handling

- **src/hooks**: Custom React hooks
  - Animation hooks (useAnimationLoop, useTextAnimation)
  - State management hooks (useBaseState, useTitleState)
  - Utility hooks (useResizeEvents, useIntersectionObservers)

- **src/styles**: PostCSS stylesheets
  - Abstract styles (variables, mixins)
  - Base styles (reset, typography)
  - Component-specific styles
  - Page-specific styles

- **src/lib**: Utility functions and helpers
  - WebGL geometry creation helpers
  - IOS (Intersection Observer) utilities
  - Mathematical utilities
  - Browser detection

- **src/context**: Context providers
  - AppProvider for global state
  - LenisProvider for smooth scrolling
  - WebGLContext for 3D rendering coordination

- **public**: Static assets
  - Images, fonts, and other static resources

## 8. Dependencies Overview

### Core
- **next**: 14.1.0 - React framework
- **react**: 18.2.0 - UI library
- **react-dom**: 18.2.0 - DOM rendering for React

### Graphics and Animation
- **ogl**: 1.0.11 - Minimal WebGL library
- **gsap**: 3.12.7 - Animation library
- **lenis**: 1.2.3 - Smooth scrolling
- **split-type**: 0.3.4 - Text splitting for animations
- **msdf-bmfont-xml**: 2.7.0 - Multi-channel signed distance field font rendering

### State Management
- **zustand**: 4.4.7 - State management library

### Development Tools
- **eslint**: 8.56.0 - Code linting
- **postcss**: 8.4.32 - CSS processing
  - postcss-import
  - postcss-nesting
  - postcss-preset-env
- **prettier**: 3.1.1 - Code formatting
  - prettier-plugin-glsl: 0.2.1 - GLSL shader formatting
- **autoprefixer**: 10.4.16 - CSS vendor prefixing

---

*Document created: April 20, 2025*

