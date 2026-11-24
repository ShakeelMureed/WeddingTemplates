/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep `next build` from replacing chunks used by a running dev server.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|mp4|webm)$/i,
      type: 'asset/resource',
      generator: { filename: 'static/media/[name].[contenthash][ext]' },
    });
    return config;
  },
};

export default nextConfig;
