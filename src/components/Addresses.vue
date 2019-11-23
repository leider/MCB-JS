<template lang="pug">
  div
    question-dialog(v-model="showDialog", dialogTitle="Ungespeicherte Änderungen", dialogText="Du musst die aktuelle Adresse erst Speichern oder Abbrechen!",
      :callback="delegate('onSave')", okText="Speichern")
    v-row
      v-col
        h1.d-flex.justify-space-between Adressen
          form-buttons(:neu="delegate('onNew')", :speichern="delegate('onSave')", :loeschen="delegate('onDelete')", :reset="delegate('onReset')", :deleteQuestion="deleteAddressQuestion", :changed="addressDirty", :valid="valid")
        h4.float-right(v-if="aktuelleZahlen.anzahl") {{aktuelleZahlen.anzahl}} Meldungen - Frühstück: {{aktuelleZahlen.Sa}} Samstag, {{aktuelleZahlen.So}} Sonntag
    v-row
      v-col(md="4")
        AddressList
      v-col(md="8")
        AddressDetail(ref="detail", @valid="addressValid")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import AddressList from "@/components/AddressList.vue";
import AddressDetail from "@/components/AddressDetail.vue";
import { Action, State } from "vuex-class";
import { AktuelleZahlenJSON } from "@/types/common";
import { Adresse } from "@/types/Adresse";

@Component({ components: { AddressDetail, AddressList } })
export default class Addresses extends Vue {
  private valid: boolean = false;
  @State aktuelleZahlen!: AktuelleZahlenJSON;
  @State selectedAddress!: Adresse;
  @State addresses!: Adresse[];
  @State addressDirty!: boolean;
  @Action selectAddress: any;
  private showDialog = false;

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
      return (this.showDialog = true);
    }
    this.selectAddress(address);
  }

  delegate(name: string) {
    return () => (this.$refs.detail as any)[name]();
  }

  addressValid(e: boolean) {
    this.valid = e;
  }

  deleteAddressQuestion() {
    return `Willst Du wirklich den Eintrag von "${this.selectedAddress.vorname} ${this.selectedAddress.name}" löschen?`;
  }
}
</script>

<style></style>
