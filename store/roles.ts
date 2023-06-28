import { defineStore } from "pinia";

import { IRole } from "~/types/roles.types";

export const useRolesStore = defineStore("Roles", {
  state: () => {
    return {
      roles: [] as IRole[],
    };
  },
  getters: {
    _getRoles: (state) => state.roles,
  },
  actions: {
    async _fetchRoles() {
      try {
        const $api = useApiHook();
        const response = await $api.roles.findAll();
        this.roles = response;
      } catch (err) {}
    },
  },
});
