<template lang="pug">
  label(v-if="label", :for="name") {{ label }}:
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbLabel extends Vue {
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
}
</script>

<style></style>
