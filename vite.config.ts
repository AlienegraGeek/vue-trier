import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    fs: {
      strict: true,
    },
    host: "0.0.0.0",
    port: 2133,
  },
  plugins: [vue()],
});
