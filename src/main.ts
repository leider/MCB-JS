import App from "./App.vue";
import store from "./store";
import Vue from "vue";
import "./fonts"; // initialize font-awesome icons

import McbWidgets from "@/widgets/McbWidgets";

import routing from "./routing";

Vue.use(McbWidgets);

import Vuetify from "vuetify";

Vue.use(Vuetify);

//import "roboto-fontface/css/roboto/roboto-fontface.css";
//import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

// Vue.config.productionTip = false;

new Vue({
  router: routing,
  store,
  el: "#app",
  vuetify: new Vuetify({
    icons: {
      iconfont: "fa"
    }
  }),
  render: h => h(App)
});
