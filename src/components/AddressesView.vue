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
import { addresses } from "@/store/store";

import AddressList from "@/components/AddressList.vue";
import AddressDetail from "@/components/AddressDetail.vue";
import { AktuelleZahlenJSON } from "@/types/common";
import { Adresse } from "@/types/Adresse";

@Component({ components: { AddressDetail, AddressList } })
export default class AddressesView extends Vue {
  @addresses.State aktuelleZahlen!: AktuelleZahlenJSON;
  @addresses.State selectedAddress!: Adresse;
  @addresses.State addresses!: Adresse[];

  @addresses.Action selectAddress: any;
  @addresses.Action saveAddress: any;
  @addresses.Action deleteAddress: any;

  private address: Adresse = Adresse.emptyAddress();
  private addressDirty: boolean = false;

  @Watch("selectedAddress")
  selectedAddressChanged() {
    this.selectAddressIfNotDirty();
  }

  @Watch("address", { deep: true })
  somethingChanged() {
    const dirty = JSON.stringify(this.selectedAddress.toJSON()) !== JSON.stringify(this.address.toJSON());
    this.addressDirty = dirty;
  }

  initModel() {
    this.address = this.selectedAddress.copy();
  }

  selectAddressIfNotDirty() {
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
            this.onSave();
          }
          this.initModel();
        });
    }
    this.initModel();
  }

  onSave() {
    this.saveAddress(this.address);
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
  }
}
</script>

<style></style>
