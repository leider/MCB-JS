<template lang="pug">
  .btn-group.float-right
    mcb-button(v-if="speichern" @click="speichern", variant="standard", size="lg", :icon="['fas', 'save']", text="Speichern", :disabled="!changed || !valid")
    mcb-button(v-if="neu" @click="neu", variant="info", size="lg", :icon="['fas', 'file']", text="Neu", :disabled="changed")
    mcb-button(v-if="kopieren" @click="kopieren", variant="warning", size="lg", :icon="['far', 'copy']", text="Kopieren", :disabled="changed")
    mcb-button(v-if="reset" @click="reset", variant="light", size="lg", :icon="['fas', 'undo']", text="Abbrechen", :disabled="!changed")
    mcb-button(v-if="loeschen" @click="loeschen", variant="error", size="lg", :icon="['fas', 'trash-alt']", text="Löschen", :disabled="changed")
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
