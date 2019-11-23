<template lang="pug">
  #treffen-detail
    alert-box(v-model="transferStatus", :seconds=10)
    v-row
      v-col(md="8")
        v-row
          v-col(md="4")
            mcb-input(label="Name", name="name", v-model="treffen.name", required)
          v-col(md="8")
            mcb-input(label="Beschreibung", name="beschreibung", v-model="treffen.beschreibung")
        v-row
          v-col(md="4")
            mcb-checkbox(label="ist Gespann", name="gespann", v-model="treffen.gespann")
          v-col(md="4")
            mcb-currency(label="Preis Meldung", name="preisMeldung", v-model="treffen.preisMeldung")
          v-col(md="4")
            mcb-currency(label="Preis Frühstück", name="preisFruehstueck", v-model="treffen.preisFruehstueck")
      v-col(md="4")
        mcb-von-bis(label="Datum", name="datum", v-model="vonBis")
    v-row
      v-col
        h2 E-Mail Vorschau
          mcb-button.float-right(@click="createEmptyPDF", text="PDF Vorschau", :icon="['far', 'file-pdf']")
        hr
        div(v-html="preview")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Treffen } from "@/types/Treffen";
import { Action, State } from "vuex-class";
import { StatusMeldungJSON } from "@/types/common";
import McbVonBis from "@/widgets/McbVonBis.vue";
@Component({
  components: { McbVonBis }
})
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

  get vonBis() {
    return [this.treffen.start, this.treffen.ende];
  }

  set vonBis(vonBis) {
    this.treffen.start = vonBis[0];
    this.treffen.ende = vonBis[1];
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
    this.deleteTreffen(this.treffen);
  }

  onNew() {
    this.treffen = Treffen.emptyTreffen();
  }

  onCopy() {
    this.initModel();
    this.treffen.id = 0;
  }

  createEmptyPDF() {
    this.transferStatus = { severity: "info", message: `Erzeuge PDF zum Download...` };
    window.open("createEmptyEinladung" + "?treffen=" + encodeURIComponent(JSON.stringify(this.treffen)));
  }
}
</script>

<style></style>
