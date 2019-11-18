<template lang="pug">
  v-menu(v-model="menu2", :id="name", :name="name", :close-on-content-click="false", :nudge-right="40", transition="scale-transition", offset-y, min-width="290px")
    template(v-slot:activator="{ on }")
      v-text-field(v-model="date", :label="label", append-icon="fa-calendar-alt", readonly, v-on="on")
    v-date-picker(v-model="date" @input="menu2 = false", locale="de")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class McbDatum extends Vue {
  @Prop({ type: Date }) value!: Date;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  private menu2: boolean = false;

  get date() {
    return this.value.toISOString().substr(0, 10);
  }
  set date(val) {
    this.$emit("input", new Date(val));
  }
}
</script>

<style></style>
