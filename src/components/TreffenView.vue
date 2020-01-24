<template lang="pug">
  div
    alert-box(v-model="transferStatus")
    .row
      .col-12
        .page-header
          h2 Treffen
            form-buttons(:neu="onNew", :speichern="onSave", :kopieren="onCopy" :loeschen="onDelete", :reset="onReset", :changed="treffenDirty", :valid="true")
          b-button-toolbar.float-right
            .btn-group.btn-group-sm
              mcb-button(@click="prepareSendEmails", text="E-Mails...", icon="far fa-paper-plane")
              mcb-button(@click="createPDFs", text="Briefe...", icon="fas fa-envelope-open-text")
    .row
      nav.col-md-3
        TreffenList
      main.col-md-9
        TreffenDetail(ref="detail", :treffen="treff")
</template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";

  import TreffenList from "@/components/TreffenList.vue";
  import TreffenDetail from "@/components/TreffenDetail.vue";
  import { Adresse, filterMap } from "@/types/Adresse";
  import { Treffen } from "@/types/Treffen";
  import { StatusMeldungJSON } from "@/types/common";
  import store, { addresses, treffen } from "@/store/store";
  import { Action } from "vuex-class";
  import { Route } from "vue-router";
  import { openOrDownloadPDF } from "@/remoteCalls";


  @Component({
  components: { TreffenList, TreffenDetail }
})
export default class TreffenView extends Vue {
  @addresses.State addresses!: Adresse[];
  @treffen.State treffen!: Treffen[];
  @treffen.State aktuellesTreffen!: Treffen;
  @treffen.State selectedTreffen!: Treffen;

  @treffen.Action selectTreffen: any;
  @treffen.Action saveTreffen: any;
  @treffen.Action deleteTreffen: any;

  @Action sendEmails: any;

  private treffenDirty = false;
  private transferStatus: StatusMeldungJSON | null = null;
  private treff = Treffen.emptyTreffen();

  @Watch("selectedTreffen")
  initModel() {
    this.treff = this.selectedTreffen.copy();
  }

  @Watch("treff", { deep: true })
  somethingChanged() {
    this.treffenDirty = JSON.stringify(this.selectedTreffen.toJSON()) !== JSON.stringify(this.treff.toJSON());
  }

  mounted() {
    this.initModel();
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    if (!from.path.startsWith("/treffen") && to.params.id === "0") {
      const id = store.state.treffen.selectedTreffen.id.toString();
      if (id !== "0") {
        return next(`/treffen/${id}`);
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

  checkRouteChange(next: Function) {
    if (this.treffenDirty) {
      return this.$bvModal.msgBoxOk("Du musst das aktuelle Treffen erst Speichern oder Abbrechen!", {
        okVariant: "success",
        okTitle: "Ach so...",
        centered: true
      });
    }
    next();
  }

  onSave() {
    this.saveTreffen(this.treff);
    this.treffenDirty = false;
  }

  onReset() {
    this.initModel();
  }

  onDelete() {
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich das Treffen "${this.treff.beschreibung} löschen?`, {
        okVariant: "danger",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true
      })
      .then(yesNo => {
        if (yesNo) {
          this.deleteTreffen(this.treff);
        }
      });
  }

  onNew() {
    this.treff = Treffen.emptyTreffen();
    this.selectTreffen(this.treff);
  }

  onCopy() {
    this.initModel();
    this.treff.id = 0;
    this.selectTreffen(this.treff);
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
          const callback = (status: StatusMeldungJSON) => (this.transferStatus = status);
          this.sendEmails({ receiverIds, callback: callback });
        }
      });
  }

  createPDFs() {
    const receiverIds = this.addresses.filter(filterMap["Einladungen Brief"]()).map(a => a.id);
    this.transferStatus = { severity: "info", message: `Erzeuge ${receiverIds.length} PDFs zum Download...` };
    openOrDownloadPDF(`/createEinladungen?treffen=${encodeURIComponent(JSON.stringify(this.aktuellesTreffen))}&receiverIds=${encodeURIComponent(
      JSON.stringify(receiverIds)
    )}`);
  }
}
</script>

<style></style>
