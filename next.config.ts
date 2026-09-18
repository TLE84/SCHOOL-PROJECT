import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo: images are supplied as arbitrary URLs from the admin editor (and the
    // seed data), rather than uploaded to a configured store. Disabling the
    // optimizer lets any src render without a per-host allowlist. Real image
    // upload/optimization arrives with the deferred storage layer.
    unoptimized: true,
  },
};

export default nextConfig;
