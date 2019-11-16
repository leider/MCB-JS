<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-form-select(:options="options", :id="name", :name="name", v-model="selected")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbSelect extends Vue {
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Array, default: "" }) readonly options!: string[];

  get selected() {
    return this.value;
  }
  set selected(val) {
    this.$emit("input", val);
  }
}
</script>

<style></style>
