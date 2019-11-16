<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-form-input( :id="name", :value="value",
      :placeholder="placeholder", @input="$emit('input', $event)",
      :name="name", :state="valid", type="email", ref="widget" )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class McbEmail extends Vue {
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;
  valid: boolean | null = null;

  @Watch("value")
  validate() {
    this.valid = !(this.$refs.widget as any).checkValidity() ? false : null;
  }
}
</script>

<style></style>
