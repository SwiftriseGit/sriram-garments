import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Custom cacheLife profiles for fine-grained SWR boundaries
  cacheLife: {
    // Product catalog: 5 min fresh → 15 min SWR window → 24 h hard expire
    catalog: {
      stale: 300,
      revalidate: 900,
      expire: 86400,
    },
    // Admin dashboard stats: near-realtime for store owner
    realtime: {
      stale: 10,
      revalidate: 30,
      expire: 60,
    },
    // Static content (about, policies): long-lived
    static: {
      stale: 3600,
      revalidate: 86400,
      expire: 604800,
    },
  },
};

export default nextConfig;