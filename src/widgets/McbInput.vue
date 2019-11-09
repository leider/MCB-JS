<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-form-input(:id="name", :value="value", :placeholder="placeholder", :required="required", @input="$emit('input', $event)", :name="name", :state="valid", type="text")
    .invalid-feedback Muss ausgefüllt werden
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import McbLabel from "@/widgets/McbLabel.vue";

@Component({
  components: { McbLabel }
})
export default class McbInput extends Vue {
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: String, default: "" }) readonly placeholder!: string;
  valid: boolean | null = null;

  @Watch("value")
  validate() {
    if (this.required) {
      if (!this.value) {
        this.valid = false;
      } else {
        this.valid = null;
      }
    }
  }
}
</script>

<style></style>
