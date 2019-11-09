<template lang="pug">
  .btn-group.float-right
    b-button(v-if="speichern" @click="speichern", variant="primary", :disabled="!changed || !valid")
      font-awesome-icon(:icon="['fas', 'save']", size="lg")
      | #{' '} Speichern
    b-button(v-if="neu" @click="neu", variant="success", :disabled="changed")
      font-awesome-icon(:icon="['fas', 'file']", size="lg")
      | #{' '} Neu
    b-button(v-if="kopieren" @click="kopieren", variant="warning", :disabled="changed")
      font-awesome-icon(:icon="['far', 'copy']", size="lg")
      | #{' '} Kopieren
    b-button(v-if="reset" @click="reset", variant="secondary", :disabled="!changed")
      font-awesome-icon(:icon="['fas', 'undo']", size="lg")
      | #{' '} Abbrechen
    b-button(v-if="loeschen" @click="loeschen", variant="danger", :disabled="changed")
      font-awesome-icon(:icon="['fas', 'trash-alt']", size="lg")
      | #{' '} Löschen

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FormButtons extends Vue {
  @Prop({ type: Function }) speichern?: () => void;
  @Prop({ type: Function }) neu?: () => void;
  @Prop({ type: Function }) kopieren?: () => void;
  @Prop({ type: Function }) reset?: () => void;
  @Prop({ type: Function }) loeschen?: () => void;
  @Prop({ type: Boolean }) changed?: boolean;
  @Prop({ type: Boolean }) valid?: boolean;
}
</script>

<style scoped></style>
