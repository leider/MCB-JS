<template lang="pug">
  .row
    .col-5
      mcb-input(name="suche", v-model="suchtext", placeholder="Suche nach ...")
    .col-5
      mcb-select(name="suche", v-model="activeFilter", :options="alleFilter")
    .col-2
      b.form-text.text-right {{anzahl}}
</template>

<script lang="ts">
  import { filterMap } from "@/types/Adresse";
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";

  @Component
export default class AddressListFilter extends Vue {
  @Prop({ type: Number }) anzahl!: number;
  private suchtext: string = "";
  private activeFilter: string = "Alle";

  get alleFilter() {
    return Object.keys(filterMap);
  }

  @Watch("suchtext")
  suchtextChanged() {
    this.activeFilter = this.suchtext ? "Suche" : "Alle";
    this.activeFilterChanged();
  }

  @Watch("activeFilter")
  activeFilterChanged() {
    const filterFunc = filterMap[this.activeFilter];
    if (this.activeFilter === "Suche") {
      this.$emit("input", filterFunc(this.suchtext));
    } else {
      this.suchtext = "";
      this.$emit("input", filterFunc);
    }
  }
}
</script>

<style></style>
