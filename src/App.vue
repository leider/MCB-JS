<template lang="pug">
  #app
    b-navbar(variant="dark", type="dark", sticky)
      b-navbar-brand MCB Bruhrain e.V.
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav
          b-nav-item(@click="selectAddresses", :active="isAdressen") Adressen
          b-nav-item(@click="selectTreffen", :active="!isAdressen") Treffen
    .container-fluid
      .row
        .col-12
          Addresses(v-if="isAdressen").mt-2
          treffen-view(v-if="!isAdressen").mt-2
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";

import Addresses from "@/components/Addresses.vue";
import TreffenView from "@/components/TreffenView.vue";

@Component({
  components: { Addresses, TreffenView }
})
export default class App extends Vue {
  private selectedView: string = "adressen";

  @Action getAllTreffen: any;
  @Action getAllAddresses: any;

  get isAdressen() {
    return this.selectedView === "adressen";
  }

  created() {
    this.getAllTreffen();
    this.getAllAddresses();
  }

  selectAddresses() {
    this.selectView("adressen");
  }

  selectTreffen() {
    this.selectView("treffen");
  }

  selectView(viewName: string) {
    this.selectedView = viewName;
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

@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
.custom-check {
  padding-top: $font-size-base * 2;
}

label {
  font-weight: $font-weight-bold;
}
</style>
