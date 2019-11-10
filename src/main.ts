import App from "./App.vue";
import store from "./store";
import Vue from "vue";
import "./fonts"; // initialize font-awesome icons

import BootstrapVue from "bootstrap-vue";

import McbWidgets from "@/widgets/McbWidgets";

import router from "./routing";

Vue.use(BootstrapVue);
Vue.use(McbWidgets);

// Vue.config.productionTip = false;

new Vue({
  router,
  store,
  el: "#app",
  render: h => h(App)
});
