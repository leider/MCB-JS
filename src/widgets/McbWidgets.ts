import Vue, { PluginObject } from "vue";

import AlertBox from "@/widgets/AlertBox.vue";
import FormButtons from "@/widgets/FormButtons.vue";
import McbButton from "@/widgets/McbButton.vue";
import McbCheckbox from "@/widgets/McbCheckbox.vue";
import McbCount from "@/widgets/McbCount.vue";
import McbCurrency from "@/widgets/McbCurrency.vue";
import McbDatum from "@/widgets/McbDatum.vue";
import McbEmail from "@/widgets/McbEmail.vue";
import McbInput from "@/widgets/McbInput.vue";
import McbLabel from "@/widgets/McbLabel.vue";
import McbSelect from "@/widgets/McbSelect.vue";

class McbWidgets implements PluginObject<any> {
  install(vm: typeof Vue) {
    vm.component("AlertBox", AlertBox);
    vm.component("FormButtons", FormButtons);
    vm.component("McbButton", McbButton);
    vm.component("McbCheckbox", McbCheckbox);
    vm.component("McbCount", McbCount);
    vm.component("McbCurrency", McbCurrency);
    vm.component("McbDatum", McbDatum);
    vm.component("McbEmail", McbEmail);
    vm.component("McbInput", McbInput);
    vm.component("McbLabel", McbLabel);
    vm.component("McbSelect", McbSelect);
  }
}

export default new McbWidgets();
