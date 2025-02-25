# Ensure shader directories exist
mkdir -p src/app/gl/effects/about
mkdir -p src/app/gl/effects/footer
mkdir -p src/app/gl/effects/grid
mkdir -p src/app/gl/effects/image
mkdir -p src/app/gl/effects/loader
mkdir -p src/app/gl/effects/ripple
mkdir -p src/app/gl/effects/roll
mkdir -p src/app/gl/effects/slides
mkdir -p src/app/gl/effects/terrain

# Move & Rename GLSL Files
mv src/app/gl/effects/oglAbout/🧪msdf.glsl src/app/gl/effects/about/msdf.fragment.glsl
mv src/app/gl/effects/oglAbout/🧪parent.glsl src/app/gl/effects/about/parent.fragment.glsl
mv src/app/gl/effects/oglFooter/🧪msdf.glsl src/app/gl/effects/footer/msdf.fragment.glsl
mv src/app/gl/effects/oglFooter/🧪parent.glsl src/app/gl/effects/footer/parent.fragment.glsl
mv src/app/gl/effects/oglGrid/🧪main.glsl src/app/gl/effects/grid/main.fragment.glsl
mv src/app/gl/effects/oglGrid/🩻main.glsl src/app/gl/effects/grid/main.vertex.glsl
mv src/app/gl/effects/oglImage/🧪main.glsl src/app/gl/effects/image/main.fragment.glsl
mv src/app/gl/effects/oglImage/🩻main.glsl src/app/gl/effects/image/main.vertex.glsl
mv src/app/gl/effects/oglLoader/🧪main.glsl src/app/gl/effects/loader/main.fragment.glsl
mv src/app/gl/effects/oglLoader/��main.glsl src/app/gl/effects/loader/main.vertex.glsl
mv src/app/gl/effects/oglRipple/🧪msdf.glsl src/app/gl/effects/ripple/msdf.fragment.glsl
mv src/app/gl/effects/oglRipple/🩻msdf.glsl src/app/gl/effects/ripple/msdf.vertex.glsl
mv src/app/gl/effects/oglRoll/🧪single.glsl src/app/gl/effects/roll/single.fragment.glsl
mv src/app/gl/effects/oglRoll/��single.glsl src/app/gl/effects/roll/single.vertex.glsl
mv src/app/gl/effects/oglSlides/🧪main.glsl src/app/gl/effects/slides/main.fragment.glsl
mv src/app/gl/effects/oglSlides/🧪parent.glsl src/app/gl/effects/slides/parent.fragment.glsl
mv src/app/gl/effects/oglSlides/🩻main.glsl src/app/gl/effects/slides/main.vertex.glsl
mv src/app/gl/effects/oglTerrain/🧪main.glsl src/app/gl/effects/terrain/main.fragment.glsl
mv src/app/gl/effects/oglTerrain/��main.glsl src/app/gl/effects/terrain/main.vertex.glsl

# Remove old directories
rm -rf src/app/gl/effects/oglAbout
rm -rf src/app/gl/effects/oglFooter
rm -rf src/app/gl/effects/oglGrid
rm -rf src/app/gl/effects/oglImage
rm -rf src/app/gl/effects/oglLoader
rm -rf src/app/gl/effects/oglRipple
rm -rf src/app/gl/effects/oglRoll
rm -rf src/app/gl/effects/oglSlides
rm -rf src/app/gl/effects/oglTerrain
