import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      name: "smart-ellipsis",
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs", "umd"],
      fileName: (format) => {
        if (format === "es") return `smart-ellipsis.mjs`;
        if (format === "cjs") return `smart-ellipsis.cjs`;
        if (format === "umd") return `smart-ellipsis.umd.js`;
        return `smart-ellipsis.${format}.js`;
      },
    },
  },
});
