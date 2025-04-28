// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1) Webpack rules for normal builds (and next dev without --turbo)
  webpack(config, { isServer }) {
    // GLSL shaders via raw + glslify
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      use: ['raw-loader', 'glslify-loader']
    });

    // SVG → React component
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // “@” → src/
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src')
    };

    // Client‑side code splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      };
    }

    return config;
  },

  // 2) Remote image domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.example.com' }
    ]
  },

  // 3) Experimental features
  experimental: {
    turbo: {
      rules: {
        '\\.(glsl|frag|vert)$': {
          loaders: ['raw-loader', 'glslify-loader'],
          as: '*.js'
        }
      }
    },
    serverComponentsExternalPackages: ['ogl'],
    optimizeCss: true,
    scrollRestoration: true
  },

  // 4) Don’t block builds on ESLint errors in dev
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development'
  },

  // 5) CORS headers for WebGL
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' }
        ]
      }
    ];
  }
};

export default nextConfig;