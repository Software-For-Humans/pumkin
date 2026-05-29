/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow imports from the parent directory (the agentkit runtime).
  // `transpilePackages` is the simplest way to bring those .ts files
  // into Next's compilation pipeline.
  experimental: { externalDir: true },
};
export default nextConfig;
