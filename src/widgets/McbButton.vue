<template lang="pug">
  b-button(v-on="$listeners", :variant="variantClass", :disabled="disabled")
    font-awesome-icon(v-if="icon", :icon="icon", :size="size || 'sm'")
    | #{' '} {{text}}

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbButton extends Vue {
  @Prop({ type: String, default: "" }) readonly text!: string;
  @Prop({ type: Array }) readonly icon!: string[];
  @Prop({ type: String, default: "" }) readonly size!: string;
  @Prop({ type: String, default: "" }) readonly variant!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  get variantClass() {
    const translate = {
      standard: "primary",
      light: "secondary",
      info: "success",
      warning: "warning",
      error: "danger"
    };
    return (translate as any)[this.variant || "standard"];
  }
}
</script>

<style></style>
