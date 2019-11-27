<template lang="pug">
  #address-list
    AddressListFilter(v-model="filter", :anzahl="anzahl")
    b-list-group(style="max-height:calc(100vh - 13rem);overflow-y: scroll")
      b-list-group-item.pt-1.pb-1( v-for="address in filteredAddresses", :key="address.id", :to="`/adressen/${address.id}`",
        :class="{active: address.id === selectedAddress.id}", :id="`item-address${address.id}`")
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
import { State } from "vuex-class";
import AddressListFilter from "@/components/AddressListFilter.vue";

@Component({
  components: { AddressListFilter }
})
export default class AddressList extends Vue {
  @State addresses!: Adresse[];
  @State selectedAddress!: Adresse;

  private filter: () => (a: Adresse) => boolean = () => () => true;

  get anzahl() {
    return this.filteredAddresses.length;
  }

  get filteredAddresses() {
    return this.addresses.filter(this.filter());
  }

  @Watch("filteredAddresses")
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
