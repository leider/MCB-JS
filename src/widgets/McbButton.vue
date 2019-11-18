<template lang="pug">
  v-btn(v-on="$listeners", :color="variantClass", :disabled="disabled", tile)
    v-icon(v-if="icon", left) {{icon[0]}} fa-{{icon[1]}}
    | &nbsp; {{text}}

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
      error: "error"
    };
    return (translate as any)[this.variant || "standard"];
  }
}
</script>

<style></style>
