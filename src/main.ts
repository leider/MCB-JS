import App from "./App.vue";
import store from "./store";
import Vue from "vue";

import McbWidgets from "@/widgets/McbWidgets";

import routing from "./routing";

Vue.use(McbWidgets);

import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";

// Vue.config.productionTip = false;

new Vue({
  router: routing,
  store,
  el: "#app",
  vuetify,
  render: h => h(App)
});
