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
}
</script>

<style></style>
