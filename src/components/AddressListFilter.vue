<template lang="pug">
  v-row
    v-col(md="5")
      mcb-input(name="suche", v-model="suchtext", placeholder="Suche nach ...")
    v-col(md="5")
      mcb-select(name="suche", v-model="activeFilter", :options="alleFilter")
    v-col(md="2")
      mcb-input(v-model="anzahl", readonly)
</template>

<script lang="ts">
import { filterMap } from "@/types/Adresse";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import McbInput from "@/widgets/McbInput.vue";
@Component({
  components: { McbInput }
})
export default class AddressListFilter extends Vue {
  @Prop({ type: String }) anzahl!: string;
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
      this.$emit("input", filterFunc(this.suchtext));
    } else {
      this.suchtext = "";
      this.$emit("input", filterFunc);
    }
  }
}
</script>

<style></style>
