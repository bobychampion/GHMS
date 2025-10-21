/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    appDir: true,
  },
  output: 'standalone',
}

module.exports = nextConfig

