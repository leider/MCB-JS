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
import { addresses, treffen } from "@/store/store";
import { Action } from "vuex-class";

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
  @treffen.Action reselectTreffen: any;
  @treffen.Action deleteTreffen: any;

  @Action sendEmails: any;

  private treffenDirty = false;
  private transferStatus: StatusMeldungJSON | null = null;
  private treff = Treffen.emptyTreffen();

  @Watch("selectedTreffen")
  selectedTreffenChanged() {
    this.selectTreffenIfNotDirty();
  }

  @Watch("treff", { deep: true })
  somethingChanged() {
    this.treffenDirty = JSON.stringify(this.selectedTreffen.toJSON()) !== JSON.stringify(this.treff.toJSON());
  }

  initModel() {
    this.treff = this.selectedTreffen.copy();
  }

  selectTreffenIfNotDirty() {
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
            this.onSave();
          }
          this.initModel();
        });
    }
    this.initModel();
  }

  onSave() {
    this.saveTreffen(this.treff);
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
  }

  onCopy() {
    this.initModel();
    this.treff.id = 0;
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
    window.open(
      `createEinladungen?treffen=${encodeURIComponent(JSON.stringify(this.aktuellesTreffen))}&receiverIds=${encodeURIComponent(
        JSON.stringify(receiverIds)
      )}`
    );
  }
}
</script>

<style></style>
