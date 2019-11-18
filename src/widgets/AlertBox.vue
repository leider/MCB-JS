<template lang="pug">
  v-alert( v-if="value", dismissible, :type="alertVariant" ) {{alertMessage}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { StatusMeldungJSON } from "@/types/common";

@Component
export default class AlertBox extends Vue {
  @Prop({ type: Object }) value?: StatusMeldungJSON | null;
  @Prop({ type: Number }) seconds?: number;

  get alertVariant() {
    const translate = { info: "success", warning: "warning", error: "error" };
    return this.value && (translate as any)[this.value.severity];
  }

  get alertMessage() {
    return this.value && this.value.message;
  }

  get secondsToShow() {
    return this.seconds || 10;
  }

  @Watch("value")
  meldungChanged(val: StatusMeldungJSON | null) {
    if (val) {
      setTimeout(() => {
        this.$emit("input", null);
      }, this.secondsToShow * 1000);
    }
  }
}
</script>

<style></style>
