/* =======================================
             IMPORTS
   ======================================= */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';


/* =======================================
             CONFIGURATION
   ======================================= */

export default defineConfig({

  /*
   * Root directory of the project
   */
  root: path.resolve(import.meta.dirname, "../.."),

  plugins: [
    react(),
  ],

  /*
   * Base public path when serving or building the project
   */
  base: './',

  /*
   * Platform icons live in public. Brand artwork still comes from the IF API.
   */
  publicDir: path.resolve(import.meta.dirname, "../../public"),

  build: {

    /*
     * Output directory for production build
     */
    outDir: path.resolve(import.meta.dirname, "../../dist"),

    /*
     * Clears the output directory before building
     */
    emptyOutDir: true,

    /*
     * Minifier to reduce file size
     */
    minify: 'esbuild',

    /*
     * Splits CSS into separate files for better caching
     */
    cssCodeSplit: true,

    /*
     * Custom Rollup options to organize output assets
     */
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});