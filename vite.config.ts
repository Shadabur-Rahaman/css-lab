import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("@codemirror/lang-") ||
              /@lezer\/(css|html|javascript)\//.test(id)
            )
              return "editor-languages";
            if (
              id.includes("@codemirror") ||
              id.includes("@lezer") ||
              id.includes("/codemirror/")
            )
              return "code-editor";
            if (id.includes("motion")) return "motion";
            if (id.includes("react")) return "react";
          }
        },
      },
    },
  },
});
