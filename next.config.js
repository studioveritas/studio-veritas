/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  // The Client Experience page was retired; its logos now run on the Work page ticker.
  async redirects() {
    return [
      // Nov 2026: Experience became /work and Process became /principles; old links keep working.
      { source: '/experience', destination: '/work', permanent: true },
      { source: '/experience/:slug', destination: '/work/:slug', permanent: true },
      { source: '/process', destination: '/principles', permanent: true },
    ]
  },
}

module.exports = nextConfig
