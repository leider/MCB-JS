<template lang="pug">
  #treffen-detail(style="max-height:calc(100vh - 10rem);overflow-y: scroll;overflow-x: hidden")
    alert-box(v-model="transferStatus", :seconds=10)
    .row
      .col-12
        .card.mb-2
          h4.card-header.py-1.px-2 Allgemein
          .card-body.p-1
            .row
              .col-3
                mcb-input(label="Name", v-model="treffen.name", required)
              .col-6
                mcb-input(label="Beschreibung", v-model="treffen.beschreibung", required)
              .col-3
                mcb-checkbox(label="ist Gespann", v-model="treffen.gespann")

            .row
              .col-3
                mcb-datum(label="Erster Tag", v-model="treffen.start")
              .col-3
                mcb-datum(label="Letzter Tag", v-model="treffen.ende")
              .col-3
                mcb-currency(label="Preis Meldung", v-model="treffen.preisMeldung")
              .col-3
                mcb-currency(label="Preis Frühstück", v-model="treffen.preisFruehstueck")
          h4.card-header.py-1.px-2 E-Mail Vorschau
            mcb-button.btn-sm.float-right(@click="createEmptyPDF", text="PDF Vorschau", icon="far fa-file-pdf")
          .card-body.p-1
            .row
              .col-12
                div(v-html="preview")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Treffen } from "@/types/Treffen";
import { StatusMeldungJSON } from "@/types/common";
import { openOrDownloadPDF } from "@/remoteCalls";

@Component
export default class TreffenDetail extends Vue {
  @Prop() treffen?: Treffen;

  preview: string = "";
  private transferStatus: StatusMeldungJSON | null = null;

  @Watch("treffen", { deep: true })
  somethingChanged() {
    fetch("/preview.pdf?treffen=" + encodeURIComponent(JSON.stringify(this.treffen)))
      .then(response => response.text())
      .then(text => (this.preview = text));
  }

  createEmptyPDF() {
    this.transferStatus = { severity: "info", message: `Erzeuge PDF zum Download...` };
    openOrDownloadPDF("/emptyEinladung.pdf" + "?treffen=" + encodeURIComponent(JSON.stringify(this.treffen)));
  }
}
</script>

<style></style>
