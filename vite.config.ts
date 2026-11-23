import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the test build from /pulse/preview/.
// Without this base, index.html loads JS/CSS from /pulse/assets/ (production),
// which can leave the test page blank.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/pulse/",
});
