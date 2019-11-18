<template lang="pug">
  v-text-field(:id="name", :value="value", :placeholder="placeholder",
    @input="$emit('input', $event)", :label="label", :name="name",
    :rules="[validate]", type="email", ref="widget" )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbEmail extends Vue {
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;

  validate(text: string | null) {
    if (text && !text.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      return "E-Mail nicht gültig";
    }
    return true;
  }
}
</script>

<style></style>
