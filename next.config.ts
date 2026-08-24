import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  agentRules: false,
  output: "standalone",
};

export default nextConfig;
