<template lang="pug">
  div
    alert-box(v-model="transferStatus")
    .row
      .col-12
        .page-header
          h2 Treffen
            form-buttons(:neu="delegate('onNew')", :speichern="delegate('onSave')", :kopieren="delegate('onCopy')" :loeschen="delegate('onDelete')", :reset="delegate('onReset')", :changed="changed", valid=true)
          b-button-toolbar.float-right
            b-button-group(size="sm")
              mcb-button(@click="sendEmails", text="Briefe...", :icon="['far', 'paper-plane']")
              mcb-button(@click="createPDFs", text="E-Mails...", :icon="['fas', 'envelope-open-text']")
    .row
      .col-md-4
        TreffenList
      .col-md-8
        TreffenDetail(ref="detail", @changed="treffenChanged")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import TreffenList from "@/components/TreffenList.vue";
import TreffenDetail from "@/components/TreffenDetail.vue";
import { State } from "vuex-class";
import { Adresse, filterMap } from "@/types/Adresse";
import { Treffen } from "@/types/Treffen";
import { StatusMeldungJSON } from "@/types/common";
import { postAndReceiveJSON } from "@/remoteCalls";

@Component({
  components: { TreffenList, TreffenDetail }
})
export default class TreffenView extends Vue {
  @State addresses!: Adresse[];
  @State aktuellesTreffen!: Treffen;
  private transferStatus: StatusMeldungJSON | null = null;
  changed: boolean = false;

  delegate(name: string) {
    return () => (this.$refs.detail as any)[name]();
  }

  treffenChanged(e: boolean) {
    this.changed = e;
  }

  sendEmails() {
    const receiverIds = this.addresses.filter(filterMap["Einladungen E-Mail"]()).map(a => a.id);
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich ${receiverIds.length} E-Mails verschicken?`, {
        okVariant: "danger",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true
      })
      .then(yesNo => {
        if (yesNo) {
          this.transferStatus = { severity: "info", message: `Verschicke ${receiverIds.length} E-Mails...` };
          postAndReceiveJSON(
            "sendEmails",
            { receiverIds, aktuellesTreffen: this.aktuellesTreffen.toJSON() },
            (status: StatusMeldungJSON) => {
              this.transferStatus = status;
            }
          );
        }
      });
  }

  createPDFs() {
    const receiverIds = this.addresses.filter(filterMap["Einladungen Brief"]()).map(a => a.id);
    this.transferStatus = { severity: "info", message: `Erzeuge ${receiverIds.length} PDFs zum Download...` };
    window.open(
      `createEinladungen?treffen=${encodeURIComponent(JSON.stringify(this.aktuellesTreffen))}&receiverIds=${encodeURIComponent(
        JSON.stringify(receiverIds)
      )}`
    );
  }
}
</script>

<style></style>
