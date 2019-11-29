import Vue from "vue";
import Vuex from "vuex";
import { Route } from "vue-router";

import addressModule from "@/store/addressModule";
import treffenModule from "@/store/treffenModule";
import { namespace } from "vuex-class";
import { postAndReceiveJSON } from "@/remoteCalls";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    addresses: addressModule,
    treffen: treffenModule
  },
  state: {},

  mutations: {},

  actions: {
    sendEmails({ state }, { receiverIds, callback }) {
      postAndReceiveJSON("sendEmails", { receiverIds, aktuellesTreffen: state.treffen.aktuellesTreffen.toJSON() }, callback);
    },

    routeChanged({ dispatch }, route: Route) {
      if (route.path.startsWith("/adressen")) {
        return dispatch("addresses/routeChanged", route);
      }
      console.log("Path: " + route.path);
    }
  }
});

export const addresses = namespace("addresses");
export const treffen = namespace("treffen");
