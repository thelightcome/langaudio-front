import { defineStore } from "pinia";

export type TypesTheme = "light" | "dark";

export const useMainStore = defineStore("Main", {
  state: () => {
    return {
      theme: "dark" as TypesTheme,
    };
  },
  getters: {
    _getTheme: (state) => state.theme,
  },
  actions: {
    _changeTheme(payload: TypesTheme) {
      this.theme = payload;
    },
  },
});
