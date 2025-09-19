/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES ? '/Moments' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/Moments/' : '',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;