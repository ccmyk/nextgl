# MSDF Text Rendering Options for OGL in Next.js

## Overview of Legacy Implementation

The legacy project uses OGL's built-in Text component with pre-generated MSDF fonts:
- JSON files for font metrics and glyph data
- PNG files for the MSDF texture atlas
- Custom GLSL shaders for rendering

## OGL-Compatible MSDF Text Solutions

If staying with OGL rather than migrating to Three.js, here are the best options:

### 1. Improved OGL Text Component (Recommended)

OGL's built-in Text component is actually quite capable and can be upgraded with better font generation tools:

```javascript
import { Text, Texture, Program } from 'ogl'

// Modern implementation with Next.js
export async function createTextMesh(gl, options) {
  // Font loading with modern fetch API and caching
  const fontJSON = await fetch('/fonts/font.json').then(res => res.json())
  const fontTexture = new Image()
  
  await new Promise((resolve) => {
    fontTexture.onload = resolve
    fontTexture.src = '/fonts/font.png'
  })
  
  const text = new Text({
    font: fontJSON,
    text: options.text,
    width: options.width || 7.5,
    align: options.align || 'center',
    letterSpacing: options.letterSpacing || 0,
    size: options.size || 0.35,
    lineHeight: options.lineHeight || 1.035,
  })
  
  const mesh = text.createMesh()
  
  // Create texture with improved mipmapping
  const texture = new Texture(gl, { 
    image: fontTexture,
    generateMipmaps: true,
    minFilter: gl.LINEAR_MIPMAP_LINEAR
  })
  
  // Create improved shader program with better antialiasing
  mesh.program = new Program(gl, {
    vertex: /* glsl */`
      attribute vec2 uv;
      attribute vec3 position;
      attribute vec3 normal;
      
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      
      varying vec2 vUv;
      
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: /* glsl */`
      precision highp float;
      uniform sampler2D tMap;
      uniform vec3 uColor;
      
      varying vec2 vUv;
      
      void main() {
          vec3 tex = texture2D(tMap, vUv).rgb;
          float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
          float d = fwidth(signedDist) * 1.5; // Improved antialiasing
          float alpha = smoothstep(-d, d, signedDist);
      
          if (alpha < 0.01) discard;
      
          gl_FragColor.rgb = uColor;
          gl_FragColor.a = alpha;
      }
    `,
    transparent: true,
    cullFace: false,
    depthWrite: false,
    uniforms: {
      tMap: { value: texture },
      uColor: { value: options.color || [0, 0, 0] },
    },
  })
  
  return mesh
}
```

### 2. Font Generation Tools

The main improvement needed is better font generation. For this, you can use:

#### msdf-bmfont-web (Modern Web-based Generator)

This is a web-based MSDF font generator that works well with OGL:

```bash
# Install the package
npm install msdf-bmfont-web
```

```javascript
import { generateBMFont } from 'msdf-bmfont-web'

// Generate at build time or on demand
async function generateFont(fontPath, chars) {
  const font = await fetch(fontPath).then(r => r.arrayBuffer())
  
  const result = await generateBMFont(font, {
    charset: chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?',
    textureWidth: 1024,
    textureHeight: 1024,
    fontSize: 42,
    distanceRange: 4,
    fieldType: 'msdf'
  })
  
  return {
    json: result.json,
    png: result.png
  }
}
```

### 3. React Component for OGL Text

Create a clean React wrapper for the OGL Text implementation:

```jsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { createTextMesh } from '@/lib/ogl/text'

export default function OGLText({ text, color, size, letterSpacing, align }) {
  const containerRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Create and initialize OGL context
    const renderer = new Renderer({ 
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true
    })
    const gl = renderer.gl
    containerRef.current.appendChild(gl.canvas)
    
    // Create text mesh
    createTextMesh(gl, {
      text,
      color: color ? new Color(color).toArray() : [0, 0, 0],
      size,
      letterSpacing,
      align
    }).then(mesh => {
      // Setup scene
      const scene = new Transform()
      const camera = new Camera(gl)
      camera.position.z = 5
      
      mesh.setParent(scene)
      
      // Animation
      const animation = gsap.timeline()
      animation.fromTo(
        mesh.scale, 
        { x: 0, y: 0 },
        { x: 1, y: 1, duration: 0.9, ease: "power2.inOut" }
      )
      
      // Render loop
      const update = () => {
        requestAnimationFrame(update)
        renderer.render({ scene, camera })
      }
      update()
      
      setIsReady(true)
      
      return () => {
        animation.kill()
        gl.canvas.remove()
        renderer.dispose()
      }
    })
  }, [text, color, size, letterSpacing, align])
  
  return <div ref={containerRef} className="ogl-text-container" />
}
```

## Font Caching Strategy for Next.js

To optimize font loading in a Next.js environment:

1. **Pre-generate fonts at build time**:

```javascript
// scripts/generate-fonts.js
const fs = require('fs')
const path = require('path')
const { generateBMFont } = require('msdf-bmfont-web')

async function generateFonts() {
  const fontPaths = [
    'PPNeueMontreal-Medium.ttf',
    'PPNeueMontreal-Bold.ttf'
  ]
  
  for (const fontPath of fontPaths) {
    const fontName = path.basename(fontPath, path.extname(fontPath))
    const fontBuffer = fs.readFileSync(path.join('fonts', fontPath))
    
    const result = await generateBMFont(fontBuffer, {
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?',
      textureWidth: 1024,
      textureHeight: 1024,
      fontSize: 42,
      fieldType: 'msdf'
    })
    
    fs.writeFileSync(
      path.join('public', 'fonts', `${fontName}.json`),
      JSON.stringify(result.json)
    )
    
    fs.writeFileSync(
      path.join('public', 'fonts', `${fontName}.png`),
      result.png
    )
  }
}

generateFonts().catch(console.error)
```

2. **Add font preloading in Next.js**:

```jsx
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/fonts/PPNeueMontreal-Medium.json" 
          as="fetch" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/PPNeueMontreal-Medium.png" 
          as="image" 
          crossOrigin="anonymous" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## Benefits of This Approach

1. **Minimal refactoring required**:
   - Preserves the existing OGL architecture
   - Similar API to what's already in use
   - Reuses existing shader logic

2. **Modernized implementation**:
   - Better font generation tools
   - Optimized for Next.js
   - Improved performance with proper texture handling
   - React component for easier integration

3. **Improved workflow**:
   - Font generation as part of the build process
   - Caching and preloading strategies
   - Better error handling

4. **Future migration path**:
   - Sets up a structure that would make future migration to Three.js easier
   - Cleaner separation of concerns
   - Modular approach that can be updated piece by piece

This approach provides significant improvements while minimizing the refactoring effort compared to switching to Three.js.

