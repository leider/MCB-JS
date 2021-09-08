<template lang="pug">
#address-detail(style="max-height: calc(100vh - 10rem); overflow-y: scroll; overflow-x: hidden")
  alert-box(v-model="transferStatus")
  .row
    .col-12
      .card.mb-3
        .card-header.py-1.px-2
          h4 Aktuelles Treffen ({{ aktuellesTreffen.name }})
            small.float-right(v-if="address.meldung") Zum Abmelden im Dialog die Anzahl Meldungen wieder auf 0 setzen
        .card-body.p-1
          .row
            .col-4.align-self-end
              h5.form-text(v-if="address.meldung") Zu zahlen: {{ address.gesamtPreis }} €
            .col-4.align-self-end
              h5(v-if="address.meldung") {{ address.anzahlMeldung }} Meldung, {{ address.samstag }} Sa, {{ address.sonntag }} So
            .col-4
              mcb-button.btn-success.float-right(
                v-if="address.meldung",
                v-b-modal.meldung-modal,
                text="Ist gemeldet ...",
                :disabled="!address.isValid()"
              )
              mcb-button.btn-danger.float-right(
                v-if="!address.meldung",
                v-b-modal.meldung-modal,
                text="Meldung ...",
                :disabled="!address.isValid()"
              )
              b-modal#meldung-modal(
                @ok="handleMeldungOk",
                @show="meldungModalOpened",
                centered,
                no-close-on-backdrop,
                ok-variant="success",
                cancel-title="Zurück",
                ok-title="Speichern"
              )
                template(v-slot:modal-header)
                  h3 Meldung
                  h3.align-self-end Summe: {{ address.gesamtPreis }} €
                .row
                  .col-6
                  .col-6
                    h5 Frühstück
                .row
                  .col-4
                    mcb-count(:label="aktuellesTreffen.meldungLabel", v-model="address.anzahlMeldung")
                  .col-4
                    mcb-count(:label="aktuellesTreffen.samstagLabel", v-model="address.samstag")
                  .col-4
                    mcb-count(:label="aktuellesTreffen.sonntagLabel", v-model="address.sonntag")
  .row
    .col-12
      .card.mb-3
        h4.card-header.py-1.px-2 Allgemein
        .card-body.p-1
          .row
            .col-6
              mcb-input(label="Vorname", v-model="address.vorname", placeholder="Vorname des Besuchers", required)
            .col-6
              mcb-input(label="Name", v-model="address.name", placeholder="Name des Besuchers", required)
          .row
            .col-8
              mcb-input(label="Straße", v-model="address.strasse")
            .col-4
              mcb-checkbox(label="ist Mitglied", v-model="address.mitglied")
          .row
            .col-2
              mcb-select(label="Land", v-model="address.land", :options="address.laender")
            .col-2
              mcb-input(label="Postleitzahl", v-model="address.plz")
            .col-8
              mcb-input(label="Ort", v-model="address.ort")
  .row
    .col-6
      .card(:class="{ 'text-danger border-danger': address.hatEmailFehler() }")
        h4.card-header.py-1.px-2 E-Mail
          mcb-button.btn-sm.float-right(
            v-if="!address.hatEmailFehler()",
            @click="sendEmail",
            text="Einladung direkt...",
            icon="far fa-paper-plane"
          )
        .card-body.p-1
          .row
            .col-12
              mcb-email(label="Adresse", v-model="address.email", placeholder="E-Mail Adresse")
              mcb-select(label="Fehlergrund", v-model="address.fehlergrund", :options="address.fehlergruende")

      .card
        h4.card-header.py-1.px-2 Fahrzeuge
        .card-body.p-1
          .row
            .col-6
              mcb-checkbox(label="fährt Solo", v-model="address.solo", inline="true")
            .col-6
              mcb-checkbox(label="fährt Gespann", v-model="address.gespann", inline="true")
    .col-6
      .card
        h4.card-header.py-1.px-2 Besuchte Treffen
        .list-group.list-group-flush
          .list-group-item.pt-1.pb-1(v-for="t in address.besuche", :key="t.name") {{ t.name }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Adresse } from "@/types/Adresse";
import { Treffen } from "@/types/Treffen";
import { StatusMeldungJSON } from "@/types/common";
import { addresses, treffen } from "@/store/store";
import { Action } from "vuex-class";

@Component
export default class AddressDetail extends Vue {
  @Prop() address?: Adresse;
  @treffen.State aktuellesTreffen?: Treffen;

  @addresses.Action saveAddress: any;
  @Action sendInvitations: any;

  private transferStatus: StatusMeldungJSON | null = null;

  handleMeldungOk() {
    this.saveAddress(this.address);
  }

  meldungModalOpened() {
    this.address!.meldung = true;
  }

  sendEmail() {
    const receiverIds = [this.address!.id];
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich eine Einladung an ${this.address!.vorname} verschicken?`, {
        okVariant: "success",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true,
      })
      .then((yesNo) => {
        if (yesNo) {
          const callback = (status: StatusMeldungJSON) => (this.transferStatus = status);
          this.sendInvitations({ receiverIds, callback });
        }
      });
  }
}
</script>

<style></style>
