<template lang="pug">
  #treffen-detail(style="max-height:calc(100vh - 10rem);overflow-y: scroll")
    alert-box(v-model="transferStatus", :seconds=10)
    .row
      .col-12
        .card.mb-2
          h4.card-header Allgemein
          .card-body
            .row
              .col-3
                mcb-input(label="Name", name="name", v-model="treffen.name", required)
              .col-6
                mcb-input(label="Beschreibung", name="beschreibung", v-model="treffen.beschreibung", required)
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
          h4.card-header E-Mail Vorschau
            mcb-button.btn-sm.float-right(@click="createEmptyPDF", text="PDF Vorschau", icon="far fa-file-pdf")
          .card-body
            .row
              .col-12
                div(v-html="preview")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Treffen } from "@/types/Treffen";
import { StatusMeldungJSON } from "@/types/common";

@Component
export default class TreffenDetail extends Vue {
  @Prop() treffen!: Treffen;

  preview: string = "";
  private transferStatus: StatusMeldungJSON | null = null;

  @Watch("treffen", { deep: true })
  somethingChanged() {
    fetch("preview?treffen=" + encodeURIComponent(JSON.stringify(this.treffen)))
      .then(response => response.text())
      .then(text => (this.preview = text));
  }

  createEmptyPDF() {
    this.transferStatus = { severity: "info", message: `Erzeuge PDF zum Download...` };
    window.open("createEmptyEinladung" + "?treffen=" + encodeURIComponent(JSON.stringify(this.treffen)));
  }
}
</script>

<style></style>
