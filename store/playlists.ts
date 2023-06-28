import { defineStore } from "pinia";

import { IListDataRes } from "~/types/common.types";
import { IPlaylist, ISearchPlaylist } from "~/types/playlists.types";

export const usePlaylistStore = defineStore("Playlists", {
  state: () => {
    return {
      playlists: [] as IPlaylist[],
      count: 0,
    };
  },
  getters: {
    _getPlaylists: (state) => state.playlists,
    _getPlaylistsTotal: (state) => state.count,
  },
  actions: {
    async _fetchPlaylists(params: ISearchPlaylist) {
      try {
        const $api = useApiHook();
        const response: IListDataRes<IPlaylist> = await $api.playlist.findAll(
          params
        );
        this.playlists = response.rows;
        this.count = response.count;
      } catch (err) {}
    },
  },
});
