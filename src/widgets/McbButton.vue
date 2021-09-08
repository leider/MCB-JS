<template lang="pug">
b-button(v-on="$listeners", :variant="variantClass", :disabled="disabled", :size="size")
  i(v-if="icon", :class="icon")
  | #{ ' ' } {{ text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbButton extends Vue {
  @Prop() readonly text?: string;
  @Prop() readonly icon?: string[];
  @Prop() readonly size?: string;
  @Prop() readonly variant?: string;
  @Prop() readonly disabled?: boolean;

  get variantClass() {
    const translate = {
      standard: "primary",
      light: "secondary",
      info: "success",
      warning: "warning",
      error: "danger",
    };
    return (translate as any)[this.variant || "standard"];
  }
}
</script>

<style></style>
