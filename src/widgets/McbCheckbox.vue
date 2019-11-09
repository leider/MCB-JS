<template lang="pug">
  b-form-group#mcb-checkbox(:class="{'custom-check': !this.inline}")
    b-form-checkbox(:id="name", :name="name", :checked="value", @input="$emit('input', $event)")
      b {{ label }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbCheckbox extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly inline!: boolean;
}
</script>

<style></style>
