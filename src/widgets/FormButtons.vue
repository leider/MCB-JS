<template lang="pug">
.btn-group.float-right
  mcb-button(
    v-if="speichern",
    @click="speichern",
    variant="standard",
    icon="fas fa-save",
    text="Speichern",
    :disabled="!changed || !valid"
  )
  mcb-button(v-if="neu", @click="neu", variant="info", icon="fas fa-file", text="Neu", :disabled="changed")
  mcb-button(v-if="kopieren", @click="kopieren", variant="warning", icon="far fa-copy", text="Kopieren", :disabled="changed")
  mcb-button(v-if="reset", @click="reset", variant="light", icon="fas fa-undo", text="Abbrechen", :disabled="!changed")
  mcb-button(v-if="loeschen", @click="loeschen", variant="error", icon="fas fa-trash-alt", text="Löschen", :disabled="changed")
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
