/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "@/shaders": "./src/public/shaders"
      },
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: 'raw-loader',
    });
    
    // Add support for .pcss files
    config.module.rules.push({
      test: /\.pcss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ],
    });
    
    return config;
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;