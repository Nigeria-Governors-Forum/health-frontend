import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.geojson": {
        loaders: [],
        as: "*.json",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.geojson$/i,
      type: "json",
    });

    return config;
  },
};

export default nextConfig;
