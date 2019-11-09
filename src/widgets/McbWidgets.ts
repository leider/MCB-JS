import Vue, { PluginObject } from "vue";

import McbCheckbox from "@/widgets/McbCheckbox.vue";
import McbDatum from "@/widgets/McbDatum.vue";
import McbEmail from "@/widgets/McbEmail.vue";
import McbInput from "@/widgets/McbInput.vue";
import McbLabel from "@/widgets/McbLabel.vue";
import McbSelect from "@/widgets/McbSelect.vue";
import McbTextArea from "@/widgets/McbTextArea.vue";
import FormButtons from "@/widgets/FormButtons.vue";
import AlertBox from "@/widgets/AlertBox.vue";
import McbCount from "@/widgets/McbCount.vue";
import McbCurrency from "@/widgets/McbCurrency.vue";

class McbWidgets implements PluginObject<any> {
  install(vm: typeof Vue) {
    vm.component("AlertBox", AlertBox);
    vm.component("FormButtons", FormButtons);
    vm.component("McbCheckbox", McbCheckbox);
    vm.component("McbCount", McbCount);
    vm.component("McbCurrency", McbCurrency);
    vm.component("McbDatum", McbDatum);
    vm.component("McbEmail", McbEmail);
    vm.component("McbInput", McbInput);
    vm.component("McbLabel", McbLabel);
    vm.component("McbSelect", McbSelect);
    vm.component("McbTextArea", McbTextArea);
  }
}

export default new McbWidgets();
