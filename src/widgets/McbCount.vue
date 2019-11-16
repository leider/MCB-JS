<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-input-group
      b-input-group-prepend
        mcb-button(variant="secondary", @click="decrease", :icon="['fas', 'minus']")
      b-form-input.text-right.font-weight-bold(:id="name", v-model="valueString",
        :placeholder="placeholder", :required="required", :name="name", disabled=true, type="text")
      b-input-group-append
        mcb-button(variant="secondary", @click="increase", :icon="['fas', 'plus']")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class McbCount extends Vue {
  @Prop({ type: Number, default: 0 }) value!: number;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;

  get valueString() {
    return (this.value || 0).toString();
  }
  set valueString(val) {
    this.$emit("input", parseInt(val, 10));
  }

  decrease() {
    if (this.value > 0) {
      this.$emit("input", this.value - 1);
    }
  }

  increase() {
    this.$emit("input", this.value + 1);
  }
}
</script>

<style></style>
