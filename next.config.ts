import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://www.themealdb.com/images/**"),
      new URL("https://www.thecocktaildb.com/images/**"),
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
