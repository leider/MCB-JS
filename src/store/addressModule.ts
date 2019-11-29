import { Module } from "vuex";

import { Treffen } from "@/types/Treffen";
import { Adresse, AdresseJSON } from "@/types/Adresse";
import { AktuelleZahlenJSON } from "@/types/common";

import { getJson, postAndReceiveJSON } from "@/remoteCalls";
import { Route } from "vue-router";

export default <Module<any, any>>{
  namespaced: true,

  state: {
    addresses: <Adresse[]>[],
    selectedAddress: Adresse.emptyAddress(),
    addressDirty: false,
    aktuelleZahlen: <AktuelleZahlenJSON>{}
  },

  mutations: {
    addressDirty(state, dirty) {
      state.addressDirty = dirty;
    },
    setAddresses(state, { addresses, aktuellesTreffen }: { addresses: AdresseJSON[]; aktuellesTreffen: Treffen }) {
      state.addressDirty = false;
      function sortiere(addr: Adresse[]) {
        return addr.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
      const adrObjs = addresses.map(a => {
        const result = Adresse.fromJSON(a);
        result.aktuellesTreffenFetcher = () => aktuellesTreffen;
        return result;
      });
      state.addresses = sortiere(adrObjs);

      state.aktuelleZahlen = (state.addresses as Adresse[])
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
    }
  },

  actions: {
    selectAddress({ commit }, address: Adresse) {
      commit("selectAddress", address);
    },

    setAddressDirty({ commit }, dirty) {
      commit("addressDirty", dirty);
    },

    reselectAddress({ state, dispatch }, address: Adresse) {
      if (address.id) {
        const oldAddress = (state.addresses as Adresse[]).find(a => a.id === address.id);
        dispatch("selectAddress", oldAddress);
      } else {
        dispatch("selectAddress", state.addresses[0]);
      }
    },

    getAllAddresses({ state, commit, rootState }) {
      getJson("addresses.json", (addresses: AdresseJSON[]) => {
        commit("setAddresses", { addresses, aktuellesTreffen: rootState.treffen.aktuellesTreffen });
        if (this.state.selectedAddress.id === 0) {
          commit("selectAddress", state.addresses[0]);
        }
      });
    },

    saveAddress({ state, commit, rootState }, address: Adresse) {
      postAndReceiveJSON("saveAddress", address.toJSON(), (res: any) => {
        rootState.aktuellesTreffen;
        commit("setAddresses", { addresses: res.data, aktuellesTreffen: rootState.treffen.aktuellesTreffen });
        const updatedAddress = (state.addresses as Adresse[]).find(a => a.id === res.id) || state.addresses[0];
        commit("selectAddress", updatedAddress);
      });
    },

    deleteAddress({ state, commit, rootState }, address: Adresse) {
      postAndReceiveJSON("deleteAddress", address.toJSON(), (addresses: AdresseJSON[]) => {
        commit("setAddresses", { addresses, aktuellesTreffen: rootState.treffen.aktuellesTreffen });
        commit("selectAddress", state.addresses[0]);
      });
    },

    routeChanged({ state, commit }, route: Route) {
      console.log("Path: " + route.path);
      const id = parseInt(route.params.id, 10);
      if (state.selectedAddress.id === id) {
        return;
      }
      const address = (state.addresses as Adresse[]).find(a => a.id === id);
      commit("selectAddress", address);
    }
  }
};
