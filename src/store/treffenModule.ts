import { Module } from "vuex";

import { Treffen, TreffenJSON } from "@/types/Treffen";

import { getJson, postAndReceiveJSON } from "@/remoteCalls";
import { Route } from "vue-router";

export default <Module<any, any>>{
  namespaced: true,

  state: {
    treffen: <Treffen[]>[],
    selectedTreffen: Treffen.emptyTreffen(),
    treffenDirty: false,
    aktuellesTreffen: Treffen.emptyTreffen()
  },

  mutations: {
    treffenDirty(state, dirty) {
      state.treffenDirty = dirty;
    },
    setTreffen(state, treffen: TreffenJSON[]) {
      state.treffenDirty = false;
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
    selectTreffen({ commit }, treffen: Treffen) {
      commit("selectTreffen", treffen);
    },

    treffenDirty({ commit }, dirty) {
      commit("treffenDirty", dirty);
    },
    reselectTreffen({ state, dispatch }, treffen: Treffen) {
      if (treffen.id) {
        const oldTreffen = (state.treffen as Treffen[]).find(t => t.id === treffen.id);
        dispatch("selectTreffen", oldTreffen);
      } else {
        dispatch("selectTreffen", state.aktuellesTreffen);
      }
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
    },

    routeChanged({ state, commit }, route: Route) {
      const id = parseInt(route.params.id, 10);
      if (state.selectedTreffen.id === id) {
        return;
      }
      const treffen = (state.treffen as Treffen[]).find(t => t.id === id);
      if (treffen) {
        commit("selectTreffen", treffen);
      }
    }
  }
};
