/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ['@prisma/client', 'pdfkit'],
};

module.exports = nextConfig;
