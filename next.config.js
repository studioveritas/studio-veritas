/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  // The Client Experience page was retired; its logos now run on the Work page ticker.
  async redirects() {
    return [{ source: '/clients', destination: '/experience', permanent: true }]
  },
}

module.exports = nextConfig
