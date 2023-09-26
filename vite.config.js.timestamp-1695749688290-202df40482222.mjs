// vite.config.js
import { defineConfig, loadEnv, transformWithEsbuild } from "file:///E:/Project/pbd_web_manager/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Project/pbd_web_manager/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///E:/Project/pbd_web_manager/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode ? mode : "", process.cwd(), "");
  const processEnvValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val
      };
    }, {})
  };
  return {
    root: "./src",
    build: {
      outDir: "../build"
    },
    loader: { ".js": "jsx" },
    define: processEnvValues,
    plugins: [
      svgr({
        svgrOptions: {
          ref: true
        }
      }),
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          if (!id.match(/src\/.*\.js$/))
            return null;
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic"
          });
        }
      },
      react()
    ],
    server: {
      open: true,
      port: 3e3,
      hmr: {
        overlay: false
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxQcm9qZWN0XFxcXHBiZF93ZWJfbWFuYWdlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUHJvamVjdFxcXFxwYmRfd2ViX21hbmFnZXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1Byb2plY3QvcGJkX3dlYl9tYW5hZ2VyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCB0cmFuc2Zvcm1XaXRoRXNidWlsZCB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IHN2Z3IgZnJvbSBcInZpdGUtcGx1Z2luLXN2Z3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUgPyBtb2RlIDogXCJcIiwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XHJcbiAgY29uc3QgcHJvY2Vzc0VudlZhbHVlcyA9IHtcclxuICAgIFwicHJvY2Vzcy5lbnZcIjogT2JqZWN0LmVudHJpZXMoZW52KS5yZWR1Y2UoKHByZXYsIFtrZXksIHZhbF0pID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5wcmV2LFxyXG4gICAgICAgIFtrZXldOiB2YWwsXHJcbiAgICAgIH07XHJcbiAgICB9LCB7fSksXHJcbiAgfTtcclxuICByZXR1cm4ge1xyXG4gICAgcm9vdDogXCIuL3NyY1wiLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgb3V0RGlyOiBcIi4uL2J1aWxkXCIsXHJcbiAgICB9LFxyXG4gICAgbG9hZGVyOiB7IFwiLmpzXCI6IFwianN4XCIgfSxcclxuICAgIGRlZmluZTogcHJvY2Vzc0VudlZhbHVlcyxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgc3Zncih7XHJcbiAgICAgICAgc3Znck9wdGlvbnM6IHtcclxuICAgICAgICAgIHJlZjogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwidHJlYXQtanMtZmlsZXMtYXMtanN4XCIsXHJcbiAgICAgICAgYXN5bmMgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XHJcbiAgICAgICAgICBpZiAoIWlkLm1hdGNoKC9zcmNcXC8uKlxcLmpzJC8pKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAvLyBVc2UgdGhlIGV4cG9zZWQgdHJhbnNmb3JtIGZyb20gdml0ZSwgaW5zdGVhZCBvZiBkaXJlY3RseVxyXG4gICAgICAgICAgLy8gdHJhbnNmb3JtaW5nIHdpdGggZXNidWlsZFxyXG4gICAgICAgICAgcmV0dXJuIHRyYW5zZm9ybVdpdGhFc2J1aWxkKGNvZGUsIGlkLCB7XHJcbiAgICAgICAgICAgIGxvYWRlcjogXCJqc3hcIixcclxuICAgICAgICAgICAganN4OiBcImF1dG9tYXRpY1wiLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgcmVhY3QoKSxcclxuICAgIF0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgaG1yOiB7XHJcbiAgICAgICAgb3ZlcmxheTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsY0FBYyxTQUFTLDRCQUE0QjtBQUNsVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRWpCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE9BQU8sT0FBTyxJQUFJLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDdkQsUUFBTSxtQkFBbUI7QUFBQSxJQUN2QixlQUFlLE9BQU8sUUFBUSxHQUFHLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTTtBQUM5RCxhQUFPO0FBQUEsUUFDTCxHQUFHO0FBQUEsUUFDSCxDQUFDLEdBQUcsR0FBRztBQUFBLE1BQ1Q7QUFBQSxJQUNGLEdBQUcsQ0FBQyxDQUFDO0FBQUEsRUFDUDtBQUNBLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxRQUFRLEVBQUUsT0FBTyxNQUFNO0FBQUEsSUFDdkIsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLE1BQ1AsS0FBSztBQUFBLFFBQ0gsYUFBYTtBQUFBLFVBQ1gsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNEO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNLFVBQVUsTUFBTSxJQUFJO0FBQ3hCLGNBQUksQ0FBQyxHQUFHLE1BQU0sY0FBYztBQUFHLG1CQUFPO0FBSXRDLGlCQUFPLHFCQUFxQixNQUFNLElBQUk7QUFBQSxZQUNwQyxRQUFRO0FBQUEsWUFDUixLQUFLO0FBQUEsVUFDUCxDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
