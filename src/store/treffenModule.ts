import { Module } from "vuex";

import { Treffen, TreffenJSON } from "@/types/Treffen";

import { getJson, postAndReceiveJSON } from "@/remoteCalls";

export default <Module<any, any>>{
  namespaced: true,

  state: {
    treffen: <Treffen[]>[],
    selectedTreffen: Treffen.emptyTreffen(),
    aktuellesTreffen: Treffen.emptyTreffen()
  },

  mutations: {
    setTreffen(state, treffen: TreffenJSON[]) {
      function sortiere(treff: Treffen[]) {
        return treff.sort((a, b) => (a.ersterTag > b.ersterTag ? -1 : 1));
      }

      const trObjs = treffen.map(t => Treffen.fromJSON(t));
      state.treffen = sortiere(trObjs);
      state.aktuellesTreffen = state.treffen[0];
    },

    selectTreffen(state, treffen: Treffen) {
      state.selectedTreffen = treffen;
    }
  },

  actions: {
    reselectTreffen({ state, dispatch }, treffen: Treffen) {
      if (treffen.id) {
        const oldTreffen = (state.treffen as Treffen[]).find(t => t.id === treffen.id);
        dispatch("selectTreffen", oldTreffen);
      } else {
        dispatch("selectTreffen", state.aktuellesTreffen);
      }
    },

    selectTreffen({ commit }, treffen: Treffen) {
      commit("selectTreffen", treffen);
    },

    getAllTreffen({ state, commit }) {
      getJson("treffen.json", (treffen: TreffenJSON[]) => {
        commit("setTreffen", treffen);
        commit("selectTreffen", state.treffen[0]);
      });
    },

    saveTreffen({ state, commit }, treffen: Treffen) {
      postAndReceiveJSON("saveTreffen", treffen.toJSON(), (res: any) => {
        commit("setTreffen", res.data);
        const updatedTreffen = (state.treffen as Treffen[]).find(t => t.id === res.id) || state.treffen[0];
        commit("selectTreffen", updatedTreffen);
      });
    },

    deleteTreffen({ state, commit }, treffen: Treffen) {
      postAndReceiveJSON("deleteTreffen", treffen.toJSON(), (treffen: TreffenJSON[]) => {
        commit("setTreffen", treffen);
        commit("selectTreffen", state.treffen[0]);
      });
    }
  }
};
