<template lang="pug">
  div
    .row
      .col-12
        .page-header
          h2 Adressen
            form-buttons(:neu="delegate('onNew')", :speichern="delegate('onSave')", :loeschen="delegate('onDelete')", :reset="delegate('onReset')", :changed="addressDirty", :valid="valid")
          h4.float-right(v-if="aktuelleZahlen.anzahl") {{aktuelleZahlen.anzahl}} Meldungen - Frühstück: {{aktuelleZahlen.Sa}} Samstag, {{aktuelleZahlen.So}} Sonntag

    .row
      .col-md-4
        AddressList(@save="delegate('onSave')()", @cancel="delegate('onReset')()")
      .col-md-8
        AddressDetail(ref="detail", @valid="addressValid")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AddressList from "@/components/AddressList.vue";
import AddressDetail from "@/components/AddressDetail.vue";
import FormButtons from "@/widgets/FormButtons.vue";
import { State } from "vuex-class";
import { AktuelleZahlenJSON } from "@/types/common";

@Component({ components: { AddressDetail, AddressList, FormButtons } })
export default class Addresses extends Vue {
  valid: boolean = false;
  @State aktuelleZahlen!: AktuelleZahlenJSON;
  @State addressDirty!: boolean;

  delegate(name: string) {
    return () => (this.$refs.detail as any)[name]();
  }

  addressValid(e: boolean) {
    this.valid = e;
  }
}
</script>

<style></style>
