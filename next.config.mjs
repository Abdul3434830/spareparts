/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Strict mode for catching bugs early
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/wholesale",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/quotes",
        destination: "/shop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
