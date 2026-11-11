/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|mp4)$/i,
      type: 'asset/resource',
      generator: { filename: 'static/media/[name].[contenthash][ext]' },
    });
    return config;
  },
};

export default nextConfig;
