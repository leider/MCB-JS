<template lang="pug">
  b-alert( :show="value", dismissible, :variant="alertVariant" )
    p {{alertMessage}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { StatusMeldungJSON } from "@/types/common";

@Component
export default class AlertBox extends Vue {
  @Prop() value?: StatusMeldungJSON | null;
  @Prop() seconds?: number;

  get alertVariant() {
    const translate = { info: "success", warning: "warning", error: "danger" };
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
