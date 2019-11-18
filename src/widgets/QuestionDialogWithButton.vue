<template lang="pug">
  div
    mcb-button.float-right(@click="showDialog = true", :text="buttonText", :icon="icon")
    question-dialog(v-model="showDialog", :dialogTitle="dialogTitle", :dialogText="dialogText", :callback="callback", :okText="okText")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class QuestionDialogWithButton extends Vue {
  @Prop({ type: String }) readonly buttonText!: string;
  @Prop({ type: Array }) readonly icon!: string[];
  @Prop({ type: String }) readonly dialogTitle!: string;
  @Prop({ type: String }) readonly dialogText!: string;
  @Prop({ type: String }) readonly okText!: string;
  @Prop({ type: Function }) callback?: () => void;
  private showDialog: boolean = false;
}
</script>

<style></style>
