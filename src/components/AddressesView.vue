<template lang="pug">
div
  alert-box(v-model="transferStatus")
  .row
    .col-12
      .page-header
        h2 Adressen
          form-buttons(
            :neu="onNew",
            :speichern="onSave",
            :loeschen="onDelete",
            :reset="onReset",
            :changed="addressDirty",
            :valid="address.isValid()"
          )
        h4.float-right {{ aktuelleZahlen.anzahl || 'keine' }} Meldungen - Frühstück: {{ aktuelleZahlen.Sa }} Sa, {{ aktuelleZahlen.So }} So #{""}
          mcb-button(v-b-modal.mailer-modal, text="E-Mails an Auswahl schicken...", icon="far fa-paper-plane", size="sm")
          b-modal#mailer-modal(
            @ok="handleSendEmail",
            size="lg",
            centered,
            no-close-on-backdrop,
            ok-variant="success",
            cancel-title="Zurück",
            ok-title="Mails Senden"
          )
            template(v-slot:modal-header)
              h3 Mail verfassen
            .row
              .col-12
                mcb-input(label="Subject", v-model="subject", placeholder="Hier das Subject angeben")
                b-form-group(label-for="emailText", label="Text")
                  mcb-markdown#emailText(v-model="emailText", theme="primary")

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
import { AktuelleZahlenJSON, StatusMeldungJSON } from "@/types/common";
import { Adresse } from "@/types/Adresse";
import { Route } from "vue-router";
import { Action } from "vuex-class";
import McbInput from "@/widgets/McbInput.vue";
import McbMarkdown from "@/widgets/McbMarkdown.vue";

@Component({ components: { McbMarkdown, McbInput, AddressDetail, AddressList } })
export default class AddressesView extends Vue {
  @addresses.State aktuelleZahlen?: AktuelleZahlenJSON;
  @addresses.State selectedAddress?: Adresse;
  @addresses.State addresses?: Adresse[];
  @addresses.Getter filteredAddresses?: Adresse[];

  @addresses.Action selectAddress: any;
  @addresses.Action saveAddress: any;
  @addresses.Action deleteAddress: any;

  @Action sendEmails: any;

  private address = Adresse.emptyAddress();
  private addressDirty: boolean = false;
  private emailText = "";
  private subject = "";

  private transferStatus: StatusMeldungJSON | null = null;

  @Watch("selectedAddress")
  initModel() {
    this.address = this.selectedAddress!.copy();
  }

  @Watch("address", { deep: true })
  somethingChanged() {
    this.addressDirty = JSON.stringify(this.selectedAddress!.toJSON()) !== JSON.stringify(this.address.toJSON());
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

  beforeRouteLeave(to: Route, from: Route, next: Function) {
    return this.checkRouteChange(next);
  }

  beforeRouteUpdate(to: Route, from: Route, next: Function) {
    return this.checkRouteChange(next);
  }

  private checkRouteChange(next: Function) {
    if (this.addressDirty) {
      return this.$bvModal.msgBoxOk("Du musst die aktuelle Adresse erst Speichern oder Abbrechen!", {
        okVariant: "success",
        okTitle: "Ach so...",
        centered: true,
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
        centered: true,
      })
      .then((yesNo) => {
        if (yesNo) {
          this.deleteAddress(this.address);
        }
      });
  }

  onNew() {
    const aktTreffen = this.address.aktuellesTreffen;
    this.address = Adresse.emptyAddress(aktTreffen);
    this.selectAddress(this.address);
  }

  handleSendEmail() {
    const receiverIds = this.filteredAddresses!.map((a) => a.id);
    this.transferStatus = { severity: "info", message: `Verschicke ${receiverIds.length} E-Mails...` };
    const callback = (status: StatusMeldungJSON) => (this.transferStatus = status);
    this.sendEmails({ receiverIds, messageText: this.emailText, subject: this.subject, callback: callback });
    this.emailText = "";
    this.subject = "";
  }
}
</script>

<style></style>
