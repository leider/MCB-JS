<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    vuejs-datepicker(v-model="date", :id="name", :name="name", :language="de", format="d. MMM. yyyy", monday-first, bootstrap-styling)
</template>

<script lang="ts">
import VuejsDatepicker from "vuejs-datepicker";
import { de } from "vuejs-datepicker/dist/locale";

import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: { VuejsDatepicker }
})
export default class McbDatum extends Vue {
  @Prop({ type: Date }) value!: Date;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;

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
