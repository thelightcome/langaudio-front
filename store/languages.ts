import { defineStore } from "pinia";

import { ILanguage } from "~/types/languages.types";

export const useLanguageStore = defineStore("Language", {
  state: () => {
    return {
      languages: [] as ILanguage[],
    };
  },
  getters: {
    _getLanguages: (state) => state.languages,
  },
  actions: {
    async _fetchLanguages() {
      const $api = useApiHook();
      const response = await $api.langs.findAll();
      this.languages = response;
    },
  },
});
