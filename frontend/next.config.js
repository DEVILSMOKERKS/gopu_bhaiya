/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // allow all https domains
        pathname: '/**',
      }
    ],

    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      { source: '/projects', destination: '/products', permanent: true },
      { source: '/category/:slug', destination: '/products/:slug', permanent: true },
    ];
  },

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset/resource',
    });

    return config;
  },
};

module.exports = nextConfig;
