<template lang="pug">
  v-text-field(:id="name", :value="value", :placeholder="placeholder",
    :required="required", @input="$emit('input', $event)", :readonly="readonly"
    :label="label", :name="name", :rules="[validate]", type="text")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class McbInput extends Vue {
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: Boolean, default: false }) readonly readonly!: boolean;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;

  validate(value: string | null) {
    if (this.required && !value) {
      return "Muss ausgefüllt werden";
    }
    return true;
  }
}
</script>

<style></style>
