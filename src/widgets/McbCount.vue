<template lang="pug">
  b-form-group(:label-for="$id('Count')", :label="label")
    b-form-spinbutton(:id="$id('Count')", :value="value", @input="$emit('input', $event)", locale="de", min="0")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class McbCount extends Vue {
  @Prop() value!: number;
  @Prop() readonly label!: string;
}
</script>

<style></style>
