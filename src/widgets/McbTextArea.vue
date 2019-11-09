<template lang="pug">
  b-form-group
    mcb-label(:name="name", :label="label")
    b-form-textarea( :id="name", :value="value", :rows="rows", @input="$emit('input', $event)", :name="name", type="text")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import McbLabel from "@/widgets/McbLabel.vue";

@Component({
  components: { McbLabel }
})
export default class McbTextArea extends Vue {
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) readonly name!: string;
  @Prop({ type: String, default: "" }) readonly label!: string;
  @Prop({ type: String, default: "10" }) readonly rows!: string;
}
</script>

<style></style>
