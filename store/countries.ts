import { defineStore } from "pinia";

import { ICountry } from "~/types/countries.types";

export const useCountryStore = defineStore("Country", {
  state: () => {
    return {
      countries: [] as ICountry[],
    };
  },
  getters: {
    _getCountries: (state) => state.countries,
  },
  actions: {
    async _fetchCountries() {
      try {
        const $api = useApiHook();
        const response = await $api.country.findAll();
        this.countries = response;
      } catch (err) {}
    },
  },
});
