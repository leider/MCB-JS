<template lang="pug">
  #treffen-detail
    alert-box(v-model="transferStatus", :seconds=10)
    b-form()
      .row
        .col-12
          b-card.mb-2(no-body, border-variant="light")
            h4.card-header.p-2 Allgemein
            .p1
              .row
                .col-3
                  mcb-input(label="Name", name="name", v-model="treffen.name")
                .col-6
                  mcb-input(label="Beschreibung", name="beschreibung", v-model="treffen.beschreibung")
                .col-3
                  mcb-checkbox(label="ist Gespann", name="gespann", v-model="treffen.gespann")

              .row
                .col-3
                  mcb-datum(label="Erster Tag", name="ersterTag", v-model="treffen.start")
                .col-3
                  mcb-datum(label="Letzter Tag", name="letzterTag", v-model="treffen.ende")
                .col-3
                  mcb-currency(label="Preis Meldung", name="preisMeldung", v-model="treffen.preisMeldung")
                .col-3
                  mcb-currency(label="Preis Frühstück", name="preisFruehstueck", v-model="treffen.preisFruehstueck")
              .row
                .col-12
                  h2 E-Mail Vorschau
                    b-button.float-right(@click="createEmptyPDF")
                      font-awesome-icon(:icon="['far', 'file-pdf']")
                      | #{' '} PDF Vorschau
                  hr
                  div.bg-light(v-html="preview")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Treffen } from "@/types/Treffen";
import { Action, State } from "vuex-class";
import { postAndReceivePDF } from "@/remoteCalls";
import { StatusMeldungJSON } from "@/types/common";

@Component
export default class TreffenDetail extends Vue {
  @State selectedTreffen!: Treffen;
  @State aktuellesTreffen!: Treffen;

  treffen: Treffen = Treffen.emptyTreffen();
  @Action saveTreffen: any;
  @Action reselectTreffen: any;
  @Action deleteTreffen: any;
  preview: string = "";
  private transferStatus: StatusMeldungJSON | null = null;

  @Watch("selectedTreffen")
  initModel() {
    this.treffen = this.selectedTreffen.copy();
  }

  @Watch("treffen", { deep: true })
  somethingChanged() {
    this.$emit("changed", JSON.stringify(this.selectedTreffen.toJSON()) !== JSON.stringify(this.treffen.toJSON()));
    fetch("preview?treffen=" + encodeURIComponent(JSON.stringify(this.treffen)))
      .then(response => response.text())
      .then(text => (this.preview = text));
  }

  mounted() {
    this.initModel();
  }

  onSave() {
    this.saveTreffen(this.treffen);
  }

  onReset() {
    this.initModel();
  }

  onDelete() {
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich das Treffen "${this.treffen.beschreibung} löschen?`, {
        okVariant: "danger",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true
      })
      .then(yesNo => {
        if (yesNo) {
          this.deleteTreffen(this.treffen);
        }
      });
  }

  onNew() {
    this.treffen = Treffen.emptyTreffen();
  }

  onCopy() {
    this.initModel();
    this.treffen.id = 0;
  }

  createEmptyPDF() {
    this.transferStatus = { severity: "info", message: `Erzeuge PDF für neues Fenster...` };
    postAndReceivePDF("createEmptyEinladung", { aktuellesTreffen: this.treffen.toJSON() }, (data: BlobPart) => {
      const content = URL.createObjectURL(
        new Blob([data], {
          type: "application/pdf"
        })
      );
      this.transferStatus = null;
      window.open(content, "einladung");
    });
  }
}
</script>

<style></style>
