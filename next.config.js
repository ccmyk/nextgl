// next.config.js

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Setup module resolution for @ imports
  webpack: (config, { isServer }) => {
    // Configure loaders for shader files (.glsl, .frag, .vert)
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      use: [
        'raw-loader',
        'glslify-loader'
      ],
    });

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Configure path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Configure images domain for external images (if needed)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },

  // Enable necessary experimental features
  experimental: {
    // For WebGL support
    serverComponentsExternalPackages: ['ogl'],
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Disable certain ESLint rules during development
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },

  // Enable CORS headers for WebGL assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
