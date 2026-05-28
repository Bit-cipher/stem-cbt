declare module "next-pwa" {
  import type { NextConfig } from "next";

  type RuntimeCaching = {
    urlPattern: RegExp;
    handler: string;
    options?: Record<string, unknown>;
  };

  export default function withPWAInit(options: {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: RuntimeCaching[];
  }): (config: NextConfig) => NextConfig;
}
