<template lang="pug">
  #address-detail(style="max-height:calc(100vh - 10rem);overflow-y: scroll")
    alert-box(v-model="transferStatus")
    .row
      .col-12
        b-card(no-body, border-variant="light").mb-3
          h5.card-header Aktuelles Treffen
          .p-1
            .row.mt-2
              .col-4.align-self-end
                h3.m-0.form-text(v-if="address.meldung") Zu zahlen: {{ address.gesamtPreis }} €
              .col-4.align-self-end
                h5.m-0(v-if="address.meldung") {{address.anzahlMeldung}} Meldung, {{address.samstag}} Sa, {{address.sonntag}} So
              .col-4
                mcb-button.btn-success.float-right(v-if="address.meldung", v-b-modal.meldung-modal, text="Ist gemeldet ...")
                mcb-button.btn-danger.float-right(v-if="!address.meldung", v-b-modal.meldung-modal, text="Meldung ...")
                b-modal#meldung-modal(@ok="handleMeldungOk", @show="meldungModalOpened", centered, no-close-on-backdrop, ok-variant="success", cancel-title="Zurück", ok-title="Speichern")
                  template(v-slot:modal-header)
                    h3 Meldung
                    h3.align-self-end Summe: {{ address.gesamtPreis }} €
                  .row
                    .col-6
                    .col-6
                      h5 Frühstück
                  .row
                    .col-4
                      mcb-count(:label="aktuellesTreffen.meldungLabel", name="anzahlMeldung", v-model="address.anzahlMeldung")
                    .col-4
                      mcb-count(:label="aktuellesTreffen.samstagLabel", name="samstag", v-model="address.samstag")
                    .col-4
                      mcb-count(:label="aktuellesTreffen.sonntagLabel", name="sonntag", v-model="address.sonntag")
    .row
      .col-12
        b-card.mb-2(no-body)
          h4.card-header.p-2 Allgemein
          .p-1
            .row
              .col-6
                mcb-input(label="Vorname", name="vorname", v-model="address.vorname", placeholder="Vorname des Besuchers", required)
              .col-6
                mcb-input(label="Name", name="name", v-model="address.name", placeholder="Name des Besuchers", required)
            .row
              .col-8
                mcb-input(label="Straße", name="strasse", v-model="address.strasse")
              .col-4
                mcb-checkbox(label="ist Mitglied", name="mitglied", v-model="address.mitglied")
            .row
              .col-2
                mcb-select(label="Land", name="land", v-model="address.land", :options="address.laender")
              .col-2
                mcb-input(label="Postleitzahl", name="plz", v-model="address.plz")
              .col-8
                mcb-input(label="Ort", name="ort", v-model="address.ort")
    .row
      .col-6
        b-card.mb-2(no-body, :class="{'text-danger border-danger': address.hatEmailFehler()}")
          h4.card-header.p-2 E-Mail
          .p-1
            .row
              .col-12
                mcb-email(label="Adresse", name="email", v-model="address.email", placeholder="E-Mail Adresse")
                mcb-select(label="Fehlergrund", name="fehlergrund", v-model="address.fehlergrund", :options="address.fehlergruende")
                mcb-button.float-right(v-if="!address.hatEmailFehler()", @click="sendEmail", text="Einladung direkt...", :icon="['far', 'paper-plane']")

        b-card(no-body)
          h4.card-header.p-2 Fahrzeuge
          .p-1
            .row
              .col-6
                mcb-checkbox(label="fährt Solo", name="solo", v-model="address.solo", inline="true")
              .col-6
                mcb-checkbox(label="fährt Gespann", name="gespann", v-model="address.gespann", inline="true")
      .col-6
        b-card(no-body, border-variant="light")
          h4.card-header.p-2 Besuchte Treffen
          b-list-group
            b-list-group-item.pt-1.pb-1(v-for="t in address.besuche", :key="t.name") {{ t.name }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Adresse } from "@/types/Adresse";
import { Treffen } from "@/types/Treffen";
import { Action, State } from "vuex-class";
import FormButtons from "@/widgets/FormButtons.vue";
import { postAndReceiveJSON } from "@/remoteCalls";
import { StatusMeldungJSON } from "@/types/common";

@Component({ components: { FormButtons } })
export default class AddressDetail extends Vue {
  @State selectedAddress!: Adresse;
  address: Adresse = Adresse.emptyAddress();
  @State aktuellesTreffen!: Treffen;
  @Action saveAddress: any;
  @Action reselectAddress: any;
  @Action deleteAddress: any;
  @Action addressDirty: any;
  private transferStatus: StatusMeldungJSON | null = null;

  @Watch("selectedAddress")
  initModel() {
    this.address = this.selectedAddress.copy();
    this.address.aktuellesTreffenFetcher = () => this.aktuellesTreffen;
  }

  @Watch("address", { deep: true })
  somethingChanged() {
    const dirty = JSON.stringify(this.selectedAddress.toJSON()) !== JSON.stringify(this.address.toJSON());
    this.addressDirty(dirty);
    this.$emit("valid", this.address.isValid());
  }

  mounted() {
    this.initModel();
  }

  onSave() {
    this.saveAddress(this.address);
  }

  onReset() {
    this.initModel();
  }

  onDelete() {
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich den Eintrag von "${this.address.vorname} ${this.address.name}" löschen?`, {
        okVariant: "danger",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true
      })
      .then(yesNo => {
        if (yesNo) {
          this.deleteAddress(this.address);
        }
      });
  }

  onNew() {
    this.address = Adresse.emptyAddress();
  }

  handleMeldungOk() {
    this.saveAddress(this.address);
  }

  meldungModalOpened() {
    this.address.meldung = true;
  }

  sendEmail() {
    const receiverIds = [this.address.id];
    this.$bvModal
      .msgBoxConfirm(`Willst Du wirklich eine Einladung an ${this.address.vorname} verschicken?`, {
        okVariant: "success",
        cancelTitle: "Nein",
        okTitle: "Ja",
        centered: true
      })
      .then(yesNo => {
        if (yesNo) {
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
}
</script>

<style></style>
