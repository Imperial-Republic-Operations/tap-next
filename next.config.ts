import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        BUILD_VERSION: process.env.BUILD_VERSION || 'unknown',
        DEBUG_MODE: process.env.DEBUG_MODE || 'false',
    },

    ...(process.env.NODE_ENV === 'test' && {
        productionBrowserSourceMaps: true,
        telemetry: false,
        devIndicators: false,
        experimental: {
            clientInstrumentationHook: true,
        },
    }),
};

export default nextConfig;
