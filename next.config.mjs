import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration options go here.
  // Since Next.js 12+, it automatically supports tsconfig.json's `paths` and `baseUrl`.
  // No manual webpack alias configuration is needed for this.
};

export default nextConfig;