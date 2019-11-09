import Vue from "vue";
import Vuex from "vuex";

import { Treffen, TreffenJSON } from "./types/Treffen";
import { Adresse, AdresseJSON } from "./types/Adresse";

import { getJson, postAndReceiveJSON } from "./remoteCalls";
import { AktuelleZahlenJSON, StatusMeldungJSON } from "@/types/common";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    addresses: <Adresse[]>[],
    selectedAddress: Adresse.emptyAddress(),
    treffen: <Treffen[]>[],
    selectedTreffen: Treffen.emptyTreffen(),
    aktuellesTreffen: Treffen.emptyTreffen(),
    aktuelleZahlen: <AktuelleZahlenJSON>{},
    mailSendStatus: <StatusMeldungJSON>{}
  },

  mutations: {
    mailSendStatus(state, status: StatusMeldungJSON) {
      state.mailSendStatus = status;
    },

    setAddresses(state, addresses: AdresseJSON[]) {
      function sortiere(addr: Adresse[]) {
        return addr.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
      const adrObjs = addresses.map(a => {
        const result = Adresse.fromJSON(a);
        result.aktuellesTreffenFetcher = () => state.aktuellesTreffen;
        return result;
      });
      state.addresses = sortiere(adrObjs);

      state.aktuelleZahlen = state.addresses
        .filter(a => a.meldung)
        .reduce(
          (previous, a) => {
            return {
              Sa: previous.Sa + a.aktBesuch().Sa,
              So: previous.So + a.aktBesuch().So,
              anzahl: previous.anzahl + a.aktBesuch().anzahl
            };
          },
          { Sa: 0, So: 0, anzahl: 0 }
        );
    },

    selectAddress(state, address: Adresse) {
      state.selectedAddress = address;
    },

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
    selectAddress({ commit }, address: Adresse) {
      commit("selectAddress", address);
    },

    reselectAddress({ state, dispatch }, address: Adresse) {
      if (address.id) {
        const oldAddress = state.addresses.find(a => a.id === address.id);
        dispatch("selectAddress", oldAddress);
      } else {
        dispatch("selectAddress", state.addresses[0]);
      }
    },

    getAllAddresses({ state, commit }) {
      getJson("addresses.json", (addresses: AdresseJSON[]) => {
        commit("setAddresses", addresses);
        commit("selectAddress", state.addresses[0]);
      });
    },

    saveAddress({ state, commit }, address: Adresse) {
      const id = address.id;
      postAndReceiveJSON("saveAddress", address.toJSON(), (addresses: AdresseJSON[]) => {
        commit("setAddresses", addresses);
        const updatedAddress = state.addresses.find(a => a.id === id) || state.addresses[0];
        commit("selectAddress", updatedAddress);
      });
    },

    deleteAddress({ state, commit }, address: Adresse) {
      postAndReceiveJSON("deleteAddress", address.toJSON(), (addresses: AdresseJSON[]) => {
        commit("setAddresses", addresses);
        commit("selectAddress", state.addresses[0]);
      });
    },

    reselectTreffen({ state, dispatch }, treffen: Treffen) {
      if (treffen.id) {
        const oldTreffen = state.treffen.find(a => a.id === treffen.id);
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
      const id = treffen.id;
      postAndReceiveJSON("saveTreffen", treffen.toJSON(), (treffen: TreffenJSON[]) => {
        commit("setTreffen", treffen);
        const updatedTreffen = state.treffen.find(t => t.id === id) || state.treffen[0];
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
});
