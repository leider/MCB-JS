<template lang="pug">
  b-button(v-on="$listeners", :variant="variantClass", :disabled="disabled")
    font-awesome-icon(v-if="icon", :icon="icon", :size="size || 'sm'")
    | #{' '} {{text}}

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbButton extends Vue {
  @Prop() readonly text!: string;
  @Prop() readonly icon!: string[];
  @Prop() readonly size!: string;
  @Prop() readonly variant!: string;
  @Prop() readonly disabled!: boolean;

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
