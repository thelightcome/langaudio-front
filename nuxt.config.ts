import svgLoader from "vite-svg-loader";

import i18n from "./i18n";

import pwaIcons from "./public/icon-logos/icons.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      baseURL: "/api",
      apiBaseUrl: process.env.API_URL,
    },
    apiBaseUrl: process.env.API_URL,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/image-edge",
    "@vite-pwa/nuxt",
  ],
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Langaudio",
      short_name: "Langaudio",
      theme_color: "#0F0F0F",
      orientation: "portrait",
      start_url: process.env.APP_URL || "http://localhost:3000",
      icons: pwaIcons.icons,
    },
  },
  imports: {
    dirs: ["./store"],
  },
  vite: {
    plugins: [svgLoader()],
  },
  css: ["@/assets/css/main.css", "@/assets/css/animate.css"],
  i18n: i18n,
  nitro: {
    devProxy: {
      "/api": {
        target: process.env.API_URL,
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
});
