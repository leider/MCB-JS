<template lang="pug">
  b-form-group#mcb-checkbox(:class="{'custom-check': !this.inline}")
    b-form-checkbox(:id="$id('Checkbox')", :checked="value", @input="$emit('input', $event)")
      b {{ label }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class McbCheckbox extends Vue {
  @Prop() value!: boolean;
  @Prop() readonly label!: string;
  @Prop() readonly inline!: boolean;
}
</script>

<style></style>
