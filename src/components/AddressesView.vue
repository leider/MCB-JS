<template lang="pug">
  div
    .row
      .col-12
        .page-header
          h2 Adressen
            form-buttons(:neu="onNew", :speichern="onSave", :loeschen="onDelete", :reset="onReset", :changed="addressDirty", :valid="address.isValid()")
          h4.float-right(v-if="aktuelleZahlen.anzahl") {{aktuelleZahlen.anzahl}} Meldungen - Frühstück: {{aktuelleZahlen.Sa}} Samstag, {{aktuelleZahlen.So}} Sonntag

    .row
      nav.col-md-3
        AddressList
      main.col-md-9
        AddressDetail(ref="detail", :address="address")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store, { addresses } from "@/store/store";

import AddressList from "@/components/AddressList.vue";
import AddressDetail from "@/components/AddressDetail.vue";
import { AktuelleZahlenJSON } from "@/types/common";
import { Adresse } from "@/types/Adresse";
import { Route } from "vue-router";

@Component({ components: { AddressDetail, AddressList } })
export default class AddressesView extends Vue {
  @addresses.State aktuelleZahlen!: AktuelleZahlenJSON;
  @addresses.State selectedAddress!: Adresse;
  @addresses.State addresses!: Adresse[];

  @addresses.Action selectAddress: any;
  @addresses.Action saveAddress: any;
  @addresses.Action deleteAddress: any;

  private address = Adresse.emptyAddress();
  private addressDirty: boolean = false;

  @Watch("selectedAddress")
  initModel() {
    this.address = this.selectedAddress.copy();
  }

  @Watch("address", { deep: true })
  somethingChanged() {
    this.addressDirty = JSON.stringify(this.selectedAddress.toJSON()) !== JSON.stringify(this.address.toJSON());
  }

  mounted() {
    this.initModel();
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    if (!from.path.startsWith("/adressen") && to.params.id === "0") {
      const id = store.state.addresses.selectedAddress.id.toString();
      if (id !== "0") {
        return next(`/adressen/${id}`);
      }
    }
    next();
  }

  beforeRouteUpdate(to: Route, from: Route, next: any) {
    if (this.addressDirty) {
      return this.$bvModal.msgBoxOk("Du musst die aktuelle Adresse erst Speichern oder Abbrechen!", {
        okVariant: "success",
        okTitle: "Ach so...",
        centered: true
      });
    }
    next();
  }

  onSave() {
    this.saveAddress(this.address);
    this.addressDirty = false;
  }

  onReset() {
    this.initModel();
  }

  onDelete() {
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich den Eintrag von "${this.address.vorname} ${this.address.name}" löschen?`, {
        okVariant: "danger",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true
      })
      .then(yesNo => {
        if (yesNo) {
          this.deleteAddress(this.address);
        }
      });
  }

  onNew() {
    this.address = Adresse.emptyAddress();
    this.selectAddress(this.address);
  }
}
</script>

<style></style>
