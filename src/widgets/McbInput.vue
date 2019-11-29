<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-form-input(:id="name", :value="value", :placeholder="placeholder", :required="required", @input="$emit('input', $event)", :state="valid", type="text")
    .invalid-feedback Muss ausgefüllt werden
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class McbInput extends Vue {
  @Prop() value!: string;
  @Prop() readonly name!: string;
  @Prop() readonly label!: string;
  @Prop() readonly required!: boolean;
  @Prop() readonly placeholder!: string;
  valid: boolean | null = null;

  @Watch("value")
  validate() {
    if (this.required !== undefined) {
      if (!this.value || !this.value.trim()) {
        this.valid = false;
      } else {
        this.valid = null;
      }
    }
  }
}
</script>

<style></style>
