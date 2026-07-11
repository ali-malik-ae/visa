import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gate standalone on a Docker-only build flag — Vercel/Netlify use their own
  // output and would break if forced into standalone mode.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
  async redirects() {
    return [
      {
        source: "/admin/studio",
        destination: "/dashboard/cms",
        permanent: true,
      },
    ];
  },
  // A strict Content-Security-Policy is deliberately not set here — Sanity
  // Studio (/dashboard/cms) needs unsafe-eval/blob: for its bundler runtime,
  // and getting that wrong silently breaks the Studio. Add CSP separately
  // with the Studio open and tested live, not guessed here.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
