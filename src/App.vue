<template lang="pug">
  v-app
    v-app-bar(color="deep-purple accent-4", fixed, dark)
      v-toolbar-title MCB Bruhrain e.V.
      v-spacer
      v-toolbar-items
        v-btn(to="/adressen", active-class="active", text) Adressen
        v-btn(to="/treffen", active-class="active") Treffen
    v-content(style="padding-top: 32px;")
      v-container(fluid)
        v-row
          v-col
            router-view.mt-2
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component
export default class App extends Vue {
  @Action getAllTreffen: any;
  @Action getAllAddresses: any;

  created() {
    this.getAllTreffen();
    this.getAllAddresses();
  }
}
</script>

<style lang="scss">
@import "~vuetify/src/styles/main.sass";
.v-list-item__icon {
  margin: 12px 0 !important;
}
</style>
