<template lang="pug">
  b-form-group(:label-for="$id('Datum')", :label="label")
    vuejs-datepicker(v-model="date", :id="$id('Datum')", :language="de", format="d. MMM. yyyy", monday-first, bootstrap-styling)
</template>

<script lang="ts">
import VuejsDatepicker from "vuejs-datepicker";
import { de } from "vuejs-datepicker/dist/locale";

import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: { VuejsDatepicker }
})
export default class McbDatum extends Vue {
  @Prop() value!: Date;
  @Prop() readonly label!: string;

  de: any = de;

  get date() {
    return this.value;
  }
  set date(val) {
    this.$emit("input", val);
  }
}
</script>

<style></style>
