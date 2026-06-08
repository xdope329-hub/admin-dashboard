/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
  reactStrictMode: false,
  // Note: env values are sourced from `.env.local` (local dev) and from the
  // hosting platform's Environment Variables (Vercel). We intentionally do
  // NOT hardcode them here because anything in this block is baked in at
  // build time and overrides .env files - that previously kept the admin
  // pinned to http://localhost:5000 in production.
  redirects: async () => {
    return [
      { source: "/", destination: "/dashboard", permanent: true },
      { source: "/en", destination: "/dashboard", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      // Local dev API (when running the API on localhost:5000)
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      // Production API (Render). Allows Next/Image to load /uploads/* served
      // directly by Express.
      { protocol: "https", hostname: "xdope-api.onrender.com" },
      // Cloudinary - product/banner uploads end up here via the API's
      // multer-storage-cloudinary middleware.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Picsum placeholders used by the seeder.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
