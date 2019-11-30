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
import { treffen } from "@/store/store";

@Component
export default class TreffenList extends Vue {
  @treffen.State treffen!: Treffen[];
  @treffen.State selectedTreffen!: Treffen;

  alsDatum(isoString: string) {
    return new Date(isoString).toLocaleDateString();
  }
}
</script>

<style></style>
