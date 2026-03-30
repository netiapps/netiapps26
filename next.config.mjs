import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  transpilePackages: ["bootstrap"],
  devIndicators: {
    buildActivity: false,
    autoPrerender: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "2026wp.netiapps.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
