/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "@": "./src",
        "@/components": "./src/components",
        "@/lib": "./src/lib",
        "@/shaders/base": "./src/components/gl/base/shaders",
        "@/shaders/bg": "./src/components/gl/bg/shaders",
        "@/shaders/footer": "./src/components/gl/footer/shaders",
        "@/shaders/loader": "./src/components/gl/loader/shaders",
        "@/shaders/pg": "./src/components/gl/pg/shaders",
        "@/shaders/roll": "./src/components/gl/roll/shaders",
        "@/shaders/slides": "./src/components/gl/slides/shaders",
        "@/shaders/title": "./src/components/gl/title/shaders",
        "@/shaders/tta": "./src/components/gl/tta/shaders"
      }
    }
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(glsl)$/,
        use: "raw-loader",
      },
      {
        test: /\.pcss$/,
        use: ["postcss-loader"],
      }
    );
    return config;
  },
};

export default nextConfig;