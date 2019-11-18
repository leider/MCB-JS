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
$theme-colors: (
  "primary": #337ab7,
  "warning": #ebb847
);

$font-family-sans-serif: "Montserrat", Helvetica, Arial, sans-serif;
$font-family-icon: "Font Awesome 5 Free";

$font-size-base: 1rem;
$headings-font-weight: bold;
$small-font-size: 60%;

$grid-gutter-width: $font-size-base * 0.7;

$label-margin-bottom: 0rem;

$input-disabled-bg: #f8f9fa !default;
$input-color: #212529 !default;

@import "~vuetify/dist/vuetify.css";
.custom-check {
  padding-top: $font-size-base * 2;
}
</style>
