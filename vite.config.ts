import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    open: true,
    fs: {
      strict: true,
    },
    host: "0.0.0.0",
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:2040', // 后端真实数据服务地址
        changeOrigin: true,
      },
    },
  },
  plugins: [vue()],
});
