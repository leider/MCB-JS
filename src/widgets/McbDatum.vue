<template lang="pug">
b-form-group(:label-for="$id('Datum')", :label="label")
  b-form-datepicker(v-model="date", :id="$id('Datum')", locale="de", start-weekday="1")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class McbDatum extends Vue {
  @Prop() value?: Date;
  @Prop() readonly label?: string;

  get date() {
    return this.value!.toISOString().substr(0, 10);
  }
  set date(val) {
    this.$emit("input", new Date(val));
  }
}
</script>

<style></style>
