import { ManifestOptions } from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
  name: "picStitch-长图拼接",
  short_name: "picStitch",
  start_url: ".",
  background_color: "#fff",
  display: "standalone",
  icons: [
    {
      src: "/logo.svg",
      sizes: "48x48",
      type: "image/svg",
    },
    {
      src: "/logo.svg",
      sizes: "72x72",
      type: "image/svg",
    },
    {
      src: "/logo.svg",
      sizes: "96x96",
      type: "image/svg",
    },
    {
      src: "/logo.svg",
      sizes: "144x144",
      type: "image/svg",
    },
  ],
};

export default manifest;
