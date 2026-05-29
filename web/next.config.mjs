/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow imports from the parent directory (the agentkit runtime).
  experimental: { externalDir: true },
  // Standalone output bundles only the files needed to run, so the desktop
  // wrapper can ship a minimal node_modules tree (~50-100MB instead of the
  // full ~500MB+).
  output: "standalone",
};
export default nextConfig;
