<template lang="pug">
  #treffen-list
    v-list(style="max-height:calc(100vh - 13rem);overflow-y: scroll")
      v-list-item-group(v-model="selection")
        v-list-item(v-for="treff in treffen", :key="treff.id", :value="treff")
          v-list-item-content
            v-list-item-title(v-text="treff.name")
            v-list-item-subtitle {{alsDatum(treff.ersterTag)}} - {{alsDatum(treff.letzterTag)}}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Treffen } from "@/types/Treffen";
import { Action, State } from "vuex-class";

@Component
export default class TreffenList extends Vue {
  @State treffen!: Treffen[];
  @State selectedTreffen!: Treffen;
  @Action selectTreffen: any;

  get selection() {
    return this.selectedTreffen;
  }

  set selection(sel) {
    this.selectTreffen(sel);
  }

  alsDatum(unixTimestamp: number) {
    return new Date(unixTimestamp).toLocaleDateString();
  }
}
</script>

<style></style>
