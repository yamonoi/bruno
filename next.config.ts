import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "removeAttrs",
                    params: { attrs: "(width|height)" },
                  },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
