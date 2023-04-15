import path from "path";

export default {
  lazy: true,
  langDir: path.basename(__dirname),
  defaultLocale: "kk",
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    redirectOn: "root",
  },
  locales: [
    {
      code: "en",
      name: "English",
      file: "en.json",
    },
    {
      code: "kk",
      name: "Қазақша",
      file: "kk.json",
    },
    {
      code: "ru",
      name: "Русский",
      file: "ru.json",
    },
  ],
};
