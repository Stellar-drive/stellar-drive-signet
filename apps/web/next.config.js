/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace packages are consumed as TypeScript source, so Next must
  // transpile them.
  transpilePackages: ['@stellar-drive-signet/types', '@stellar-drive-signet/ui', '@stellar-drive-signet/sdk', '@stellar-drive-signet/db'],
};

module.exports = nextConfig;
