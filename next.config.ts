import type { NextConfig } from "next";
// Keep the hand-maintained project contract stable across dev sessions.
const nextConfig: NextConfig = { agentRules: false, devIndicators: false };
export default nextConfig;
