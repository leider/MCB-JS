import App from "./App.vue";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import { Vue } from "vue-property-decorator";

import {
  faCheckSquare as fasCheckSquare,
  faEnvelope as fasEnvelope,
  faEnvelopeOpenText as fasEnvelopeOpenText,
  faSave as fasSave,
  faUndo as fasUndo,
  faTrashAlt as fasTrashAlt,
  faFile as fasFile,
  faPlus as fasPlus,
  faMinus as fasMinus
} from "@fortawesome/free-solid-svg-icons";
import {
  faEnvelope as farEnvelope,
  faCopy as farCopy,
  faPaperPlane as farPaperPlane,
  faFilePdf as farFilePdf
} from "@fortawesome/free-regular-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";
library.add(
  fasCheckSquare,
  fasEnvelope,
  fasEnvelopeOpenText,
  farEnvelope,
  fasSave,
  fasUndo,
  fasTrashAlt,
  fasFile,
  fasPlus,
  fasMinus,
  farCopy,
  farPaperPlane,
  farFilePdf
);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.component("font-awesome-icon", FontAwesomeIcon);

import McbWidgets from "@/widgets/McbWidgets";

Vue.use(BootstrapVue);
Vue.use(McbWidgets);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
