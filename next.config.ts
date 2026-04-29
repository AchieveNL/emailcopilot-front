import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@neondatabase/serverless", "drizzle-orm"],
};

export default nextConfig;
