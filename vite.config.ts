import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { VitePWA } from "vite-plugin-pwa";

import manifest from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    vue(),
    VitePWA({
      manifest: manifest,
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
