<template lang="pug">
  b-form-group
    mcb-label(:name="$id('Count')", :label="label")
    b-form-spinbutton(:id="$id('Count')", :valuel="value", @input="$emit('input', $event)", locale="de", min="0")
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
