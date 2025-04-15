/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "@": "./src",
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