import { Module } from "vuex";

import { Treffen } from "@/types/Treffen";
import { Adresse, AdresseJSON } from "@/types/Adresse";
import { AktuelleZahlenJSON } from "@/types/common";

import { getJson, postAndReceiveJSON } from "@/remoteCalls";

function findForId(addresses: Adresse[], id: number, defaultReturn?: Adresse) {
  return addresses.find(a => a.id === id) || defaultReturn;
}

export default <Module<any, any>>{
  namespaced: true,

  state: {
    addresses: <Adresse[]>[],
    selectedAddress: Adresse.emptyAddress(),
    aktuelleZahlen: <AktuelleZahlenJSON>{},
    filter: () => () => true
  },

  mutations: {
    setAddresses(state, { addresses, aktuellesTreffen }: { addresses: AdresseJSON[]; aktuellesTreffen: Treffen }) {
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
    },

    setFilter(state, filter) {
      state.filter = filter;
    }
  },

  actions: {
    selectAddress({ commit }, address: Adresse) {
      commit("selectAddress", address);
    },

    getAllAddresses({ state, commit, rootState }) {
      getJson("/addresses.json", (addresses: AdresseJSON[]) => {
        commit("setAddresses", { addresses, aktuellesTreffen: rootState.treffen.aktuellesTreffen });
        if (state.selectedAddress.id === 0) {
          commit("selectAddress", state.addresses[0]);
        }
      });
    },

    saveAddress({ state, commit, rootState }, address: Adresse) {
      if (!address.isValid()) {
        return;
      }
      postAndReceiveJSON("/saveAddress", address.toJSON(), (res: any) => {
        rootState.aktuellesTreffen;
        commit("setAddresses", { addresses: res.data, aktuellesTreffen: rootState.treffen.aktuellesTreffen });
        const updatedAddress = findForId(state.addresses, res.id, state.addresses[0]);
        commit("selectAddress", updatedAddress);
      });
    },

    deleteAddress({ state, commit, rootState }, address: Adresse) {
      postAndReceiveJSON("/deleteAddress", address.toJSON(), (addresses: AdresseJSON[]) => {
        commit("setAddresses", { addresses, aktuellesTreffen: rootState.treffen.aktuellesTreffen });
        commit("selectAddress", state.addresses[0]);
      });
    },

    routeChanged({ state, commit }, idString: string) {
      const id = parseInt(idString, 10);
      if (state.selectedAddress.id === id) {
        return;
      }
      const address = findForId(state.addresses, id);
      if (address) {
        return commit("selectAddress", address);
      }
    },

    setFilter({ commit }, filter) {
      commit("setFilter", filter);
    }
  },

  getters: {
    filteredAddresses(state) {
      return state.addresses.filter(state.filter());
    }
  }
};
