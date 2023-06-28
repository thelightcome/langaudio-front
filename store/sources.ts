import { defineStore } from "pinia";

import { IListDataRes } from "~/types/common.types";
import { ISearchSource, ISource } from "~/types/sources.types";

export const useSourcesStore = defineStore("Sources", {
  state: () => {
    return {
      sources: [] as ISource[],
      count: 0,
    };
  },
  getters: {
    _getSources: (state) => state.sources,
    _getSourcesTotal: (state) => state.count,
  },
  actions: {
    async _fetchSources(params?: ISearchSource) {
      try {
        const $api = useApiHook();
        const response: IListDataRes<ISource> = await $api.source.findAll(
          params
        );
        this.sources = response.rows;
        this.count = response.count;
      } catch (err) {}
    },
  },
});
