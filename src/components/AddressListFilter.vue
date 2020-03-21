<template lang="pug">
  .row
    .col-5
      mcb-input(v-model="suchtext", placeholder="Suche nach ...")
    .col-5
      mcb-select(v-model="activeFilter", :options="alleFilter")
    .col-2
      b.form-text.text-right {{filteredAddresses.length}}
</template>

<script lang="ts">
import { Adresse, filterMap } from "@/types/Adresse";
import { Component, Vue, Watch } from "vue-property-decorator";
import { addresses } from "@/store/store";

@Component
export default class AddressListFilter extends Vue {
  @addresses.Action setFilter?: any;
  @addresses.Getter filteredAddresses?: Adresse[];
  private suchtext: string = "";
  private activeFilter: string = "Alle";

  get alleFilter() {
    return Object.keys(filterMap);
  }

  @Watch("suchtext")
  suchtextChanged() {
    this.activeFilter = this.suchtext ? "Suche" : this.activeFilter === "Suche" ? "Alle" : this.activeFilter;
    this.activeFilterChanged();
  }

  @Watch("activeFilter")
  activeFilterChanged() {
    const filterFunc = filterMap[this.activeFilter];
    if (this.activeFilter === "Suche") {
      this.setFilter(filterFunc(this.suchtext));
    } else {
      this.suchtext = "";
      this.setFilter(filterFunc);
    }
  }
}
</script>

<style></style>
