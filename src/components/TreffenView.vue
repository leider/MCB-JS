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
              mcb-button(@click="sendEmails", text="Briefe...", icon="far fa-paper-plane")
              mcb-button(@click="createPDFs", text="E-Mails...", icon="fas fa-envelope-open-text")
    .row
      nav.col-md-3
        TreffenList
      main.col-md-9
        TreffenDetail(ref="detail", @changed="treffenChanged")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import TreffenList from "@/components/TreffenList.vue";
import TreffenDetail from "@/components/TreffenDetail.vue";
import { Action, State } from "vuex-class";
import { Adresse, filterMap } from "@/types/Adresse";
import { Treffen } from "@/types/Treffen";
import { StatusMeldungJSON } from "@/types/common";
import { postAndReceiveJSON } from "@/remoteCalls";

@Component({
  components: { TreffenList, TreffenDetail }
})
export default class TreffenView extends Vue {
  @State treffen!: Treffen[];
  @State addresses!: Adresse[];
  @State aktuellesTreffen!: Treffen;
  @State selectedTreffen!: Treffen;
  @Action selectTreffen: any;
  private transferStatus: StatusMeldungJSON | null = null;
  changed: boolean = false;

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
    if (this.changed) {
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
