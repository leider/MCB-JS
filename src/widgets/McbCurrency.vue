<template lang="pug">
  v-text-field(:id="name", v-model="valueString", :placeholder="placeholder",
    :required="required", :disabled="disabled", @blur="focusLost",
    :label="label", :name="name", :rules="[validate]", type="text",
    append-icon="fa-euro-sign")

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class McbCurrency extends Vue {
  @Prop({ type: Number, default: 0 }) value!: number;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;
  private valueString: string = "";

  @Watch("value")
  valueChanged() {
    this.valueString = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false
    }).format(this.value || 0);
  }

  validate() {
    const floatNum = parseFloat(this.valueString.replace(",", "."));
    if (isNaN(floatNum)) {
      return "Bitte eine deutsche Zahl eingeben";
    }
    return true;
  }

  focusLost() {
    const floatNum = parseFloat(this.valueString.replace(",", "."));
    if (!isNaN(floatNum)) {
      this.$emit("input", floatNum);
    } else {
      this.valueChanged();
      this.$emit("input", this.value);
    }
  }
}
</script>

<style></style>
