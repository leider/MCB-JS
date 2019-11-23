<template lang="pug">
  #address-detail
    alert-box(v-model="transferStatus")

    v-row
      v-col
        h2 Aktuelles Treffen
        v-row.mt-2
          v-col(md="4").align-self-end
            h3(v-if="address.meldung") Zu zahlen: {{ address.gesamtPreis }} €
          v-col(md="4").align-self-end
            h4(v-if="address.meldung") {{address.anzahlMeldung}} Meldung, {{address.samstag}} Sa, {{address.sonntag}} So
          v-col(md="4")
            mcb-button(v-if="address.meldung", @click.stop="openMeldungDialog", variant="info", text="Ist gemeldet...")
            mcb-button(v-if="!address.meldung", @click.stop="openMeldungDialog", variant="error", text="Meldung...")
            v-dialog(v-model="meldungDialogVisible", persistent, max-width="600px")
              v-card
                v-card-title
                  span(class="headline") Meldung
                v-card-text
                  v-container
                    v-row
                      v-col
                        h1.float-right Summe: {{ address.gesamtPreis }} €
                    v-row
                      v-col(md="4")
                        mcb-count(label="Anzahl Meldung", name="anzahlMeldung", :disabled="!address.meldung", v-model="address.anzahlMeldung")
                      v-col(md="4")
                        mcb-count(:label="aktuellesTreffen.samstagLabel", name="samstag", :disabled="!address.meldung", v-model="address.samstag")
                      v-col(md="4")
                        mcb-count(:label="aktuellesTreffen.sonntagLabel", name="sonntag", :disabled="!address.meldung", v-model="address.sonntag")
                v-card-actions
                  v-spacer
                  mcb-button(text="Zurück", @click="meldungDialogVisible = false")
                  mcb-button(text="Speichern", @click="handleMeldungOk")
    v-row
      v-col
        h4.card-header.p-2 Allgemein
        v-row
          v-col(md="6")
            mcb-input(label="Vorname", name="vorname", v-model="address.vorname", placeholder="Vorname des Besuchers", required)
          v-col(md="6")
            mcb-input(label="Name", name="name", v-model="address.name", placeholder="Name des Besuchers", required)
        v-row
          v-col(md="8")
            mcb-input(label="Straße", name="strasse", v-model="address.strasse")
          v-col(md="4")
            mcb-checkbox(label="ist Mitglied", name="mitglied", v-model="address.mitglied")
        v-row
          v-col(md="3")
            mcb-select(label="Land", name="land", v-model="address.land", :options="address.laender")
          v-col(md="2")
            mcb-input(label="Postleitzahl", name="plz", v-model="address.plz")
          v-col(md="7")
            mcb-input(label="Ort", name="ort", v-model="address.ort")
    v-row
      v-col(md="6")
        h4.card-header.p-2 E-Mail
        v-row
          v-col
            mcb-email(label="E-Mail Adresse", name="email", v-model="address.email", placeholder="E-Mail Adresse")
            mcb-select(label="Fehlergrund", name="fehlergrund", v-model="address.fehlergrund", :options="address.fehlergruende")
            question-dialog-with-button.float-right(v-if="!address.hatEmailFehler()", buttonText="Einladung direkt...", okText="Abschicken",
              :icon="['far', 'paper-plane']", :callback="sendEmail", dialogTitle="E-Mail Senden?",
              :dialogText="`Willst Du wirklich eine Einladung an ${address ? address.vorname : ''} verschicken?`")

        h4.card-header Fahrzeuge
        v-row
          v-col
            mcb-checkbox(label="fährt Solo", name="solo", v-model="address.solo", inline)
            mcb-checkbox(label="fährt Gespann", name="gespann", v-model="address.gespann", inline)
      v-col(md="6")
        h4.card-header Besuchte Treffen
        v-list(dense, style="max-height:calc(100vh - 43rem);overflow-y: scroll")
          v-list-item(v-for="t in address.besuche", :key="t.name") {{ t.name }}
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
  private meldungDialogVisible = false;
  private emailDialogVisible = false;

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
    this.deleteAddress(this.address);
  }

  onNew() {
    this.address = Adresse.emptyAddress();
  }

  handleMeldungOk() {
    this.meldungDialogVisible = false;
    this.saveAddress(this.address);
  }

  openMeldungDialog() {
    this.meldungDialogVisible = true;
    this.address.meldung = true;
  }

  openEmailDialog() {
    this.emailDialogVisible = true;
  }

  sendEmail() {
    postAndReceiveJSON(
      "sendEmails",
      { receiverIds: [this.address.id], aktuellesTreffen: this.aktuellesTreffen.toJSON() },
      (status: StatusMeldungJSON) => {
        this.transferStatus = status;
      }
    );
  }
}
</script>

<style></style>
