/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        ".glsl": [{ loader: "raw-loader", options: {} }],
        ".msdf.glsl": [{ loader: "raw-loader", options: {} }],
        ".parent.glsl": [{ loader: "raw-loader", options: {} }],
        ".single.glsl": [{ loader: "raw-loader", options: {} }],
        ".main.glsl": [{ loader: "raw-loader", options: {} }],
        ".🩻main.glsl": [{ loader: "raw-loader", options: {} }],
        ".🧪main.glsl": [{ loader: "raw-loader", options: {} }],
      },
      rules: {
        glsl: [{ loader: "raw-loader", options: {} }],
        "msdf.glsl": [{ loader: "raw-loader", options: {} }],
        "parent.glsl": [{ loader: "raw-loader", options: {} }],
        "single.glsl": [{ loader: "raw-loader", options: {} }],
        "main.glsl": [{ loader: "raw-loader", options: {} }],
        "🩻main.glsl": [{ loader: "raw-loader", options: {} }],
        "🧪main.glsl": [{ loader: "raw-loader", options: {} }],
      },
    },
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;