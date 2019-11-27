<template lang="pug">
  ul.list-group(style="max-height:calc(100vh - 10rem);overflow-y: scroll")
    li.list-group-item.pt-1.pb-1(v-for="treff in treffen", :key="treff.id", @click="selectTreffen(treff)", :class="{active: treff.id === selectedTreffen.id}")
      b {{ treff.name }}
      |#{" "} ({{ alsDatum(treff.ersterTag) }} - {{ alsDatum(treff.letzterTag) }})
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

  alsDatum(unixTimestamp: number) {
    return new Date(unixTimestamp).toLocaleDateString();
  }
}
</script>

<style></style>
