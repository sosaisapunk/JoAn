import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  appType: "spa",
  base: "./",
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: "dist-static",
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    viteReact(),
  ],
});
