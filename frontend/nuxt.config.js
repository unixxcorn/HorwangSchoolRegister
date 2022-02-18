import colors from "vuetify/es5/util/colors";

export default {
  ssr: false,

  head: {
    titleTemplate: "Horwang Register",
    title: "Horwang Register",
    htmlAttrs: {
      lang: "th",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "Horwang Register",
        name: "Horwang Register",
        content: "ระบบลงทะเบียน",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  css: [],

  plugins: [
    { src: "~/plugins/axios.ts" },
    { src: "~/plugins/rules.ts" },
    { src: "~/plugins/loader.ts" },
  ],

  axios: {
    baseURL: process.env.NUXT_ENV_BASE_URL
      ? `${process.env.NUXT_ENV_BASE_URL}`
      : "http://localhost:4000",
  },

  moment: {
    defaultLocale: "th",
    locales: ["th"],
  },

  components: true,

  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/vuetify",
    "@nuxtjs/google-fonts",
  ],

  modules: ["@nuxtjs/axios", "@nuxtjs/moment"],

  googleFonts: {
    download: true,
    overwriting: true,
    useStylesheet: true,
    families: {
      Sarabun: true,
    }
  },

  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.brown.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.cyan.lighten4,
          warning: colors.amber.base,
          error: colors.red,
          success: colors.green,
        },
      },
    },
  },

  build: {},
};
