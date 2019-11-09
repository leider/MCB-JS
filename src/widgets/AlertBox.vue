<template lang="pug">
  b-alert( :show="dismissCountDown", dismissible, :variant="alertVariant", @dismissed="dismissCountDown = 0", @dismiss-count-down="countDownChanged" )
    p {{alertMessage}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { StatusMeldungJSON } from "@/types/common";

@Component
export default class AlertBox extends Vue {
  @Prop({ type: Object }) value?: StatusMeldungJSON | null;
  @Prop({ type: Number }) seconds?: number;
  private dismissCountDown: number = 0;

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

  countDownChanged(dismissCountDown: number) {
    this.dismissCountDown = dismissCountDown;
    if (this.dismissCountDown === 0) {
      this.$emit("input", null);
    }
  }

  @Watch("value")
  meldungChanged() {
    if (this.value) {
      return this.countDownChanged(this.secondsToShow);
    }
    this.countDownChanged(0);
  }
}
</script>

<style></style>
