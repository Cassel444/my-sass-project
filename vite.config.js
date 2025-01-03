import { defineConfig } from "vite";
import path from "path";
import glob from "fast-glob";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { fileURLToPath } from "url";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import purgecss from "@fullhuman/postcss-purgecss"; 

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 86 },
      jpeg: { quality: 86 },
      jpg: { quality: 86 },
    }),
    {
      ...imagemin(["./src/img/**/*.{jpg,png,jpeg}"], {
        destination: "./src/img/webp/",
        plugins: [imageminWebp({ quality: 86 })],
      }),
      apply: "serve",
    },
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(["./*.html", "./pages/**/*.html"])
          .map((file) => [
            path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  // PostCSS конфігурація для purgecss
  css: {
    postcss: {
      plugins: [
        purgecss({
          content: ["./**/*.html"], 
        }),
      ],
    },
  },
});

