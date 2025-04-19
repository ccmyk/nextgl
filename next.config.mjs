// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  turbopack: {
    resolveAlias: {
      '@': './src',
    },
    // No "loaders" key – not supported
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })
    return config
  },
}

export default nextConfig