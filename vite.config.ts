import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Respect VITE_BASE supplied by the GitHub Actions preview build.
// loadEnv avoids a direct process.env reference (Node typings are not installed).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: loadEnv(mode, ".", "VITE_").VITE_BASE || "/pulse/",
}));
