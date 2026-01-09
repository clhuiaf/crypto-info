/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable telemetry to prevent connection timeout errors
  // Telemetry can be re-enabled via NEXT_TELEMETRY_DISABLED=0 if needed

  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize webpack for better performance
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization.splitChunks.chunks = 'all'
    }
    return config
  },
}

module.exports = nextConfig


