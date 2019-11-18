<template lang="pug">
  v-checkbox(:id="name", :name="name", :value="value" :label="label", @change="$emit('input', $event)", color="success")
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
