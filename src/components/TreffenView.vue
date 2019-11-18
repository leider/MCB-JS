<template lang="pug">
  div
    alert-box(v-model="transferStatus")
    v-row
      v-col
        h2.d-flex.justify-space-between Treffen
          form-buttons(:neu="delegate('onNew')", :speichern="delegate('onSave')", :kopieren="delegate('onCopy')" :loeschen="delegate('onDelete')", :reset="delegate('onReset')", :deleteQuestion="deleteTreffenQuestion", :changed="changed", valid=true)
        v-item-group.justify-end.d-flex

          question-dialog-with-button.float-right(buttonText="E-Mails...", okText="Abschicken",
            :icon="['far', 'paper-plane']", :callback="sendEmails", dialogTitle="E-Mails Senden?",
            :dialogText="`Willst Du wirklich ${receiverIds.length} E-Mails verschicken?`")
          mcb-button(@click="createPDFs", text="Briefe...", :icon="['fas', 'envelope-open-text']")
    v-row
      v-col(md="4")
        TreffenList
      v-col(md="8")
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
  @State selectedTreffen!: Treffen;
  private transferStatus: StatusMeldungJSON | null = null;
  changed: boolean = false;

  delegate(name: string) {
    return () => (this.$refs.detail as any)[name]();
  }

  treffenChanged(e: boolean) {
    this.changed = e;
  }

  deleteTreffenQuestion() {
    return `Willst Du wirklich das Treffen "${this.selectedTreffen.beschreibung} löschen?`;
  }

  get receiverIds() {
    return this.addresses.filter(filterMap["Einladungen E-Mail"]()).map(a => a.id);
  }

  sendEmails() {
    this.transferStatus = { severity: "info", message: `Verschicke ${this.receiverIds.length} E-Mails...` };
    postAndReceiveJSON(
      "sendEmails",
      { receiverIds: this.receiverIds, aktuellesTreffen: this.aktuellesTreffen.toJSON() },
      (status: StatusMeldungJSON) => {
        this.transferStatus = status;
      }
    );
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
