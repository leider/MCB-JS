<template lang="pug">
  b-form-group(:label-for="$id('Select')", :label="label")
    b-form-select(:options="options", :id="$id('Select')", v-model="selected")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbSelect extends Vue {
  @Prop() value?: string;
  @Prop() readonly label?: string;
  @Prop() readonly options?: string[];

  get selected() {
    return this.value;
  }
  set selected(val) {
    this.$emit("input", val);
  }
}
</script>

<style></style>
