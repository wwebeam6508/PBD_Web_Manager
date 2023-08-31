import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ? mode : "", process.cwd(), "");
  const processEnvValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    }, {}),
  };
  return {
    root: "./src",
    build: {
      outDir: "../build",
    },
    loader: { ".js": "jsx" },
    define: processEnvValues,
    plugins: [
      svgr({
        svgrOptions: {
          ref: true,
        },
      }),
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          if (!id.match(/src\/.*\.js$/)) return null;

          // Use the exposed transform from vite, instead of directly
          // transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        },
      },
      react(),
    ],
    server: {
      open: true,
      port: 3000,
      hmr: {
        overlay: false,
      },
    },
  };
});
