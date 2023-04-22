import { defineStore } from "pinia";

import { IListDataRes } from "~/types/common.types";
import { IImplementor, ISearchImplementor } from "~/types/implementors.types";

export const useImplementorStore = defineStore("Implementor", {
  state: () => {
    return {
      implementors: [] as IImplementor[],
      count: 0,
    };
  },
  getters: {
    _getImplementors: (state) => state.implementors,
    _getImplementorsTotal: (state) => state.count,
  },
  actions: {
    async _fetchImplementors(params?: ISearchImplementor) {
      const $api = useApiHook();
      const response: IListDataRes<IImplementor> =
        await $api.implementor.findAll(params);
      this.implementors = response.rows;
      this.count = response.count;
    },
  },
});
