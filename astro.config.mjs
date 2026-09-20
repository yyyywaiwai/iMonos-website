// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://imonos-website.pages.dev",
  // The legacy site shipped `.html` URLs; keeping them avoids breaking
  // links already shared in Discord and indexed by search engines.
  build: { format: "file" },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
