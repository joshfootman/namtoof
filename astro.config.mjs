// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

const assetsPrefix =
  process.env.CF_PAGES === "1" ? process.env.CF_PAGES_URL : undefined;

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  build: { assetsPrefix },
  vite: {
    plugins: [
      tailwindcss(),
      svgr({
        include: "**/*.svg?react",
        svgrOptions: {
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
          svgoConfig: {
            plugins: [
              "preset-default",
              "removeTitle",
              "removeDesc",
              "removeDoctype",
              "cleanupIds",
            ],
          },
        },
      }),
    ],
  },
});
