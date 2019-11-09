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
              b-button(@click="sendEmails")
                font-awesome-icon(:icon="['far', 'paper-plane']")
                | #{' '} Einladungen
              b-button(@click="createPDFs")
                font-awesome-icon(:icon="['fas', 'envelope-open-text']")
                | #{' '} Einladungen
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
import { postAndReceiveJSON, postAndReceivePDF } from "@/remoteCalls";

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
    this.transferStatus = { severity: "info", message: `Erzeuge ${receiverIds.length} PDFs in neuem Fenster...` };
    postAndReceivePDF("createEinladungen", { receiverIds, aktuellesTreffen: this.aktuellesTreffen.toJSON() }, (data: BlobPart) => {
      const content = URL.createObjectURL(
        new Blob([data], {
          type: "application/pdf"
        })
      );
      this.transferStatus = null;
      window.open(content, "einladungen");
    });
  }
}
</script>

<style></style>
