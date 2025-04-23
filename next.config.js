module.exports = {
  output: 'export',
  staticPageGenerationTimeout: 1000,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
    ],
  },
}
