import App from "./App.vue";
import store from "./store";
import Vue from "vue";

import BootstrapVue from "bootstrap-vue";

import McbWidgets from "@/widgets/McbWidgets";

import routing from "./routing";

import "@fortawesome/fontawesome-free/js/all";

Vue.use(BootstrapVue);
Vue.use(McbWidgets);

// Vue.config.productionTip = false;

new Vue({
  router: routing,
  store,
  el: "#app",
  render: h => h(App)
});
