/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    // Blog covers and author avatars are served from the ContioReach CDN.
    remotePatterns: [{ protocol: "https", hostname: "contiocdn.com" }],
  },
};

export default nextConfig;
