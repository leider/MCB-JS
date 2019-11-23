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
  @Prop() speichern?: () => void;
  @Prop() neu?: () => void;
  @Prop() kopieren?: () => void;
  @Prop() reset?: () => void;
  @Prop() loeschen?: () => void;
  @Prop() changed?: boolean;
  @Prop() valid?: boolean;
}
</script>

<style scoped></style>
