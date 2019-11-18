<template lang="pug">
  #address-list
    AddressListFilter(v-model="filter", :anzahl="anzahl")
    .row
      .col-12
        v-list(style="max-height:calc(100vh - 18rem);overflow-y: scroll")
          v-list-item(v-for="address in filteredAddresses", :key="address.id", :value="address", :to="`/adressen/${address.id}`")
            v-list-item-icon
              v-icon(color="grey lighten-1", v-if="!address.meldung") far fa-square
              v-icon(color="success", v-if="address.meldung") far fa-check-square
            v-list-item-content
              v-list-item-title {{address.listText}}
            v-list-item-icon
              v-icon(color="error", v-if="address.hatEmailFehler()") fa-envelope
              v-icon(color="success", v-if="!address.hatEmailFehler() && address.email") far fa-envelope
              v-icon(color="warning", v-if="!address.hatEmailFehler() && !address.email") fa-envelope
</template>

<script lang="ts">
import { Adresse } from "@/types/Adresse.ts";
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import AddressListFilter from "@/components/AddressListFilter.vue";

@Component({
  components: { AddressListFilter }
})
export default class AddressList extends Vue {
  @State addresses!: Adresse[];
  @Action selectAddress!: any;

  private filter: () => (a: Adresse) => boolean = () => () => true;

  get anzahl() {
    return this.filteredAddresses.length.toString();
  }

  get filteredAddresses() {
    return this.addresses.filter(this.filter());
  }
}
</script>

<style></style>
