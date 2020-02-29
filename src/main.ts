import App from "./App.vue";
import store from "./store/store";
import Vue from "vue";

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

import McbWidgets from "@/widgets/McbWidgets";
Vue.use(McbWidgets);

import UniqueId from "vue-unique-id";
Vue.use(UniqueId);

import routing from "./routing";

// Vue.config.productionTip = false;

new Vue({
  router: routing,
  store,
  el: "#app",
  render: h => h(App)
});
