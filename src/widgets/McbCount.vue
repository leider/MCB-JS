<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-input-group
      b-input-group-prepend
        mcb-button(@click="decrease", icon="fas fa-minus")
      b-form-input.text-right(:id="name", v-model="valueString", disabled, type="text")
      b-input-group-append
        mcb-button(@click="increase", icon="fas fa-plus")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class McbCount extends Vue {
  @Prop() value!: number;
  @Prop() readonly name!: string;
  @Prop() readonly label!: string;

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
