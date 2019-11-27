<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-form-input( :id="name", :value="value", :placeholder="placeholder", @input="$emit('input', $event)",
      :state="valid", type="email", ref="widget" )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class McbEmail extends Vue {
  @Prop() value!: string;
  @Prop() readonly name!: string;
  @Prop() readonly label!: string;
  @Prop() readonly placeholder!: string;
  valid: boolean | null = null;

  @Watch("value")
  validate() {
    this.valid = this.value && !this.value.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) ? false : null;
  }
}
</script>

<style></style>
