/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "@/shaders/base": "./src/components/gl/base/shaders",
        "@/shaders/bg": "./src/components/gl/bg/shaders",
        "@/shaders/footer": "./src/components/gl/footer/shaders",
        "@/shaders/loader": "./src/components/gl/loader/shaders",
        "@/shaders/pg": "./src/components/gl/pg/shaders",
        "@/shaders/roll": "./src/components/gl/roll/shaders",
        "@/shaders/slides": "./src/components/gl/slides/shaders",
        "@/shaders/title": "./src/components/gl/title/shaders",
        "@/shaders/tta": "./src/components/gl/tta/shaders"
      },
      loaders: {
        ".glsl": [{ loader: "raw-loader", options: {} }],
        ".msdf.glsl": [{ loader: "raw-loader", options: {} }],
        ".parent.glsl": [{ loader: "raw-loader", options: {} }],
        ".single.glsl": [{ loader: "raw-loader", options: {} }],
        ".main.glsl": [{ loader: "raw-loader", options: {} }],
        "frag.main.glsl": [{ loader: "raw-loader", options: {} }],
        "vert.main.glsl": [{ loader: "raw-loader", options: {} }],
        "frag.msdf.glsl": [{ loader: "raw-loader", options: {} }],
        "vert.msdf.glsl": [{ loader: "raw-loader", options: {} }],
        "frag.parent.glsl": [{ loader: "raw-loader", options: {} }],
        "vert.parent.glsl": [{ loader: "raw-loader", options: {} }],
        ".pcss": [
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: true
              }
            }
          }
        ]
      }
    },
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;