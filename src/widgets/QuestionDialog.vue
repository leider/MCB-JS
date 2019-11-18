<template lang="pug">
  v-dialog(v-model="value", persistent, max-width="600px")
    v-card
      v-card-title
        span(class="headline") {{dialogTitle}}
      v-card-text {{dialogText}}
      v-card-actions
        v-spacer
        mcb-button(text="Abbrechen", @click="$emit('input', false)")
        mcb-button(:text="okText", @click="okPressed")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class QuestionDialog extends Vue {
  @Prop({ type: String }) readonly dialogTitle!: string;
  @Prop({ type: String }) readonly dialogText!: string;
  @Prop({ type: String }) readonly okText!: string;
  @Prop({ type: Function }) callback?: () => void;
  @Prop({ type: Boolean, default: false }) value!: boolean;

  okPressed() {
    this.callback && this.callback();
    this.$emit("input", false);
  }
}
</script>

<style></style>
