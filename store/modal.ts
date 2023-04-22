import { defineStore } from "pinia";

export const useModalStore = defineStore("Modal", {
  state: () => {
    return {
      type: "" as string,
      data: null as any,
    };
  },
  getters: {
    _getType: (state) => state.type,
    _getData: (state) => state.data,
  },
  actions: {
    _openModal(type: string, data?: any) {
      this.type = type;
      if (data) {
        if (typeof data === "object") {
          this.data = JSON.parse(JSON.stringify(data));
        } else this.data = data;
      }
    },
    _close() {
      this.type = "";
      this.data = null;
    },
  },
});
