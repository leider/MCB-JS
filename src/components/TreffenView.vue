<template lang="pug">
  div
    alert-box(v-model="transferStatus")
    .row
      .col-12
        .page-header
          h2 Treffen
            form-buttons(:neu="delegate('onNew')", :speichern="delegate('onSave')", :kopieren="delegate('onCopy')" :loeschen="delegate('onDelete')", :reset="delegate('onReset')", :changed="changed", :valid="true")
          b-button-toolbar.float-right
            .btn-group.btn-group-sm
              mcb-button(@click="prepareSendEmails", text="E-Mails...", icon="far fa-paper-plane")
              mcb-button(@click="createPDFs", text="Briefe...", icon="fas fa-envelope-open-text")
    .row
      nav.col-md-3
        TreffenList
      main.col-md-9
        TreffenDetail(ref="detail")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import TreffenList from "@/components/TreffenList.vue";
import TreffenDetail from "@/components/TreffenDetail.vue";
import { Adresse, filterMap } from "@/types/Adresse";
import { Treffen } from "@/types/Treffen";
import { StatusMeldungJSON } from "@/types/common";
import { addresses, treffen } from "@/store/store";
import { Action } from "vuex-class";

@Component({
  components: { TreffenList, TreffenDetail }
})
export default class TreffenView extends Vue {
  @treffen.State treffen!: Treffen[];
  @addresses.State addresses!: Adresse[];
  @treffen.State aktuellesTreffen!: Treffen;
  @treffen.State selectedTreffen!: Treffen;
  @treffen.State treffenDirty!: boolean;
  @treffen.Action selectTreffen: any;
  @Action sendEmails: any;
  private transferStatus: StatusMeldungJSON | null = null;

  @Watch("$route")
  routeChanged() {
    this.selectTreffenIfNotDirty();
  }

  @Watch("treffen")
  @Watch("selectedtreffen")
  selectionChanged() {
    if (this.selectedTreffen.id === parseInt(this.$route.params.id, 10)) {
      return;
    }
    this.$router.push(`/treffen/${this.selectedTreffen.id}`);
  }

  delegate(name: string) {
    return () => (this.$refs.detail as any)[name]();
  }

  selectTreffenIfNotDirty() {
    const treff = this.treffen.find(t => t.id === parseInt(this.$route.params.id, 10));
    if (!treff) {
      return;
    }
    if (this.treffenDirty) {
      return this.$bvModal
        .msgBoxConfirm("Du musst das aktuelle Treffen erst Speichern oder Abbrechen!", {
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
    this.selectTreffen(treff);
  }

  prepareSendEmails() {
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
          this.sendEmails({
            receiverIds,
            callback: (status: StatusMeldungJSON) => {
              this.transferStatus = status;
            }
          });
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
