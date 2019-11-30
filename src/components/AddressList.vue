<template lang="pug">
  #address-list
    AddressListFilter
    b-list-group(style="max-height:calc(100vh - 13rem);overflow-y: scroll")
      b-list-group-item.pt-1.pb-1( v-for="address in filteredAddresses", :key="address.id", :to="`/adressen/${address.id}`",
        :active="address.id === selectedAddress.id", :id="`item-address${address.id}`")
        i.fa-envelope(:class="envelopeClass(address)")
        | #{" "}
        span(:class="{'text-danger': address.hatEmailFehler()}")
          |{{ address.listText }}
        | #{" "}
        i.text-success.fas.fa-check-square.fa-lg(v-if="address.meldung")
</template>

<script lang="ts">
import { Adresse } from "@/types/Adresse.ts";
import { Component, Vue, Watch } from "vue-property-decorator";
import { addresses } from "@/store/store";

import AddressListFilter from "@/components/AddressListFilter.vue";

@Component({
  components: { AddressListFilter }
})
export default class AddressList extends Vue {
  @addresses.State addresses!: Adresse[];
  @addresses.State selectedAddress!: Adresse;
  @addresses.Getter filteredAddresses!: Adresse[];

  @Watch("filteredAddresses")
  @Watch("selectedAddress")
  filterChanged() {
    this.$nextTick(() => {
      const elementById = document.getElementById(`item-address${this.selectedAddress.id}`);
      if (elementById) {
        elementById.scrollIntoView(false);
      }
    });
  }

  envelopeClass(address: Adresse) {
    if (address.hatEmailFehler()) {
      return "fas text-danger";
    }
    if (address.email) {
      return "far text-success";
    }
    return "far text-warning";
  }
}
</script>

<style></style>
