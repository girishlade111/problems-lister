/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/problems-lister",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig