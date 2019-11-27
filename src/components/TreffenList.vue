<template lang="pug">
  b-list-group(style="max-height:calc(100vh - 10rem);overflow-y: scroll")
    b-list-group-item.pt-1.pb-1(v-for="treff in treffen", :key="treff.id", :to="`/treffen/${treff.id}`",
      :class="{active: treff.id === selectedTreffen.id}", :id="`item-treffen${treff.id}`")
      b {{ treff.name }}
      |#{" "} ({{ alsDatum(treff.ersterTag) }} - {{ alsDatum(treff.letzterTag) }})
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Treffen } from "@/types/Treffen";
import { State } from "vuex-class";

@Component
export default class TreffenList extends Vue {
  @State treffen!: Treffen[];
  @State selectedTreffen!: Treffen;

  alsDatum(unixTimestamp: number) {
    return new Date(unixTimestamp).toLocaleDateString();
  }
}
</script>

<style></style>
