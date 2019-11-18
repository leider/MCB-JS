<template lang="pug">
  v-text-field.mcb-count(:id="name", v-model="valueString", :placeholder="placeholder",
    :required="required", :label="label", :name="name", :rules="[validate]",
    type="text", prepend-icon="fa-minus", append-outer-icon="fa-plus",
    @click:prepend="decrease", @click:append-outer="increase",
    ref="textfield")

</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class McbCount extends Vue {
  @Prop({ type: Number, default: 0 }) value!: number;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;

  created() {
    this.$refs.textfield as any;
  }

  get valueString() {
    return (this.value || 0).toString();
  }

  set valueString(val) {
    this.$emit("input", parseInt(this.valueString, 10));
  }

  validate(val: string) {
    const floatNum = parseInt(val, 10);
    if (isNaN(floatNum)) {
      return false;
    }
    return true;
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

<style>
.mcb-count input {
  text-align: end;
}
</style>
