import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    FACEBOOK_POST_URL: process.env.FACEBOOK_POST_URL ?? "",
    ZALO_NOTIFY_GROUP_URL: process.env.ZALO_NOTIFY_GROUP_URL ?? "",
    ZALO_HELP_URL: process.env.ZALO_HELP_URL ?? "",
  },
};

export default nextConfig;
