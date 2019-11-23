<template lang="pug">
  v-menu(v-model="menu", :id="name", :name="name", :close-on-content-click="false",
    :nudge-right="40", transition="scale-transition", offset-y, min-width="290px")
    template(v-slot:activator="{ on }")
      v-text-field(v-model="dateStringLocal", :label="label", append-icon="fa-calendar-alt", readonly, v-on="on")
    v-date-picker(v-model="dateStringISO", locale="de", first-day-of-week=1, range)
      v-spacer
      v-btn(text, color="primary", @click="menu = false") Abbruch
      v-btn(text, color="primary", @click="saveRange(dateStringISO)") OK
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class McbVonBis extends Vue {
  @Prop({ type: Array }) value!: Date[];
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  private menu: boolean = false;
  private dateStringISO: string[] = [];

  saveRange(range: string[]) {
    if (range.length === 2) {
      this.menu = false;
      const start = new Date(range[0]);
      const end = new Date(range[1]);
      this.$emit("input", start < end ? [start, end] : [end, start]);
    }
  }

  @Watch("value")
  valueChanged(val: Date[]) {
    this.dateStringISO = this.dateToStringArray(val);
  }

  dateToStringArray(val: Date[]) {
    return [val[0].toISOString().substr(0, 10), val[1].toISOString().substr(0, 10)];
  }

  get dateStringLocal() {
    const iso = this.dateToStringArray(this.value);
    const [year1, month1, day1] = iso[0].split("-");
    const [year2, month2, day2] = iso[1].split("-");
    return `${day1}.${month1}.${year1} bis ${day2}.${month2}.${year2}`;
  }
}
</script>

<style></style>
