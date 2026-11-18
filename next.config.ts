import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Basic security headers for every page and API response.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Do not let other sites show this app inside a frame.
          { key: "X-Frame-Options", value: "DENY" },
          // Do not let the browser guess file types.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send only the site address, not the full page URL, to other sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The app does not use the camera API, microphone or location.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
