import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/customer": {
        target: "http://localhost:3001/customer",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:3001/auth",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
