/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  experimental: {
      optimizePackageImports: ["@chakra-ui/react"],
  },
    
};

export default nextConfig;
