import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*\/api\/exams.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "exam-api-cache",
        expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      urlPattern: /^https?.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "http-cache",
        expiration: { maxEntries: 96, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default withPWA(nextConfig);
