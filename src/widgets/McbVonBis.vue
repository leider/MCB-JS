<template lang="pug">
  v-date-picker(v-model="dateStringISO", locale="de", first-day-of-week=1, range, no-title, :picker-date="pickerDate", @input="updateValue")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class McbVonBis extends Vue {
  @Prop({ type: Array }) value!: Date[];
  private noOfClicks: number = 0;
  private pickerDate: string = "";
  private dateStringISO: string[] = [];

  @Watch("value")
  valueChanged(val: Date[]) {
    this.dateStringISO = [val[0].toISOString().substr(0, 10), val[1].toISOString().substr(0, 10)];
    this.noOfClicks = 0;
    this.pickerDate = val[0].toISOString().substr(0, 7);
    setTimeout(() => {
      this.pickerDate = "";
    }, 1000);
  }

  updateValue() {
    const start = new Date(this.dateStringISO[0]);
    const end = new Date(this.dateStringISO[1]);
    this.noOfClicks++;
    if (this.noOfClicks === 2) {
      this.$emit("input", start < end ? [start, end] : [end, start]);
    }
  }
}
</script>

<style></style>
