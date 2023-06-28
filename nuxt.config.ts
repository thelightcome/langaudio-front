import svgLoader from "vite-svg-loader";

import i18n from "./i18n";

import pwaIcons from "./public/icon-logos/icons.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  // app: {
  //   head: {
  //     script: [{ src: "https://www.youtube.com/iframe_api" }],
  //   },
  // },
  runtimeConfig: {
    public: {
      baseURL: "/api/",
      apiBaseUrl:
        process.env.NODE_ENV === "production" ? process.env.API_URL : "/api/",
    },
    apiBaseUrl:
      process.env.NODE_ENV === "production" ? process.env.API_URL : "/api/",
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
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
    server: {
      proxy: {
        "/api": {
          target: process.env.API_URL,
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
        },
      },
    },
  },
  css: ["@/assets/css/main.css", "@/assets/css/animate.css"],
  i18n: i18n,
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
});
