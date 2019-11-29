<template lang="pug">
  div
    .row
      .col-12
        .page-header
          h2 Adressen
            form-buttons(:neu="delegate('onNew')", :speichern="delegate('onSave')", :loeschen="delegate('onDelete')", :reset="delegate('onReset')", :changed="addressDirty", :valid="valid")
          h4.float-right(v-if="aktuelleZahlen.anzahl") {{aktuelleZahlen.anzahl}} Meldungen - Frühstück: {{aktuelleZahlen.Sa}} Samstag, {{aktuelleZahlen.So}} Sonntag

    .row
      nav.col-md-3
        AddressList
      main.col-md-9
        AddressDetail(ref="detail", @valid="addressValid")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { addresses } from "@/store/store";

import AddressList from "@/components/AddressList.vue";
import AddressDetail from "@/components/AddressDetail.vue";
import { AktuelleZahlenJSON } from "@/types/common";
import { Adresse } from "@/types/Adresse";

@Component({ components: { AddressDetail, AddressList } })
export default class AddressesView extends Vue {
  valid: boolean = false;
  @addresses.State aktuelleZahlen!: AktuelleZahlenJSON;
  @addresses.State selectedAddress!: Adresse;
  @addresses.State addresses!: Adresse[];
  @addresses.State addressDirty!: boolean;
  @addresses.Action selectAddress: any;

  created() {
    this.selectAddressIfNotDirty();
  }

  @Watch("$route")
  routeChanged() {
    this.selectAddressIfNotDirty();
  }

  @Watch("addresses")
  @Watch("selectedAddress")
  selectionChanged() {
    if (this.selectedAddress.id === parseInt(this.$route.params.id, 10)) {
      return;
    }
    this.$router.push(`/adressen/${this.selectedAddress.id}`);
  }

  selectAddressIfNotDirty() {
    const address = this.addresses.find(a => a.id === parseInt(this.$route.params.id, 10));
    if (!address) {
      return;
    }
    if (this.addressDirty) {
      return this.$bvModal
        .msgBoxConfirm("Du musst die aktuelle Adresse erst Speichern oder Abbrechen!", {
          okVariant: "success",
          okTitle: "Speichern",
          cancelTitle: "Abbrechen",
          centered: true
        })
        .then(yesNo => {
          if (yesNo) {
            this.delegate("onSave")();
          } else {
            this.delegate("onReset")();
          }
        });
    }
    this.selectAddress(address);
  }

  delegate(name: string) {
    return () => (this.$refs.detail as any)[name]();
  }

  addressValid(e: boolean) {
    this.valid = e;
  }
}
</script>

<style></style>