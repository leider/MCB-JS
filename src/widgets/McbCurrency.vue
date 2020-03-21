<template lang="pug">
  b-form-group(:label-for="$id('Currency')", :label="label")
    b-input-group
      b-form-input.text-right(:id="$id('Currency')", v-model="valueString",
        :placeholder="placeholder", :required="required",
        :disabled="disabled", @blur="focusLost",
        step=0.01, :state="valid", type="text")
      b-input-group-append: b-input-group-text €
      .invalid-feedback Bitte eine deutsche Zahl eingeben
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class McbCurrency extends Vue {
  @Prop() value?: number;
  @Prop() readonly label?: string;
  @Prop() readonly required?: boolean;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly placeholder?: string;
  valid: boolean | null = null;
  valueString: string = "";

  @Watch("value")
  valueChanged() {
    this.valueString = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false
    }).format(this.value || 0);
  }

  @Watch("valueString")
  validate() {
    const floatNum = parseFloat(this.valueString.replace(",", "."));
    if (isNaN(floatNum)) {
      this.valid = false;
    } else {
      this.valid = null;
    }
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
