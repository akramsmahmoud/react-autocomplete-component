import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts(), eslint()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "react-autocomplete-component",
      fileName: (format) => `react-autocomplete-component.${format}.js`,
    },
  },
});
