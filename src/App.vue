<template lang="pug">
  #app
    b-navbar(variant="dark", type="dark", sticky)
      b-navbar-brand MCB Bruhrain e.V.
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav
          b-nav-item(to="/addressesView", active-class="active") Adressen
          b-nav-item(to="/treffenView", active-class="active") Treffen
    .container-fluid
      .row
        .col-12
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

@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
.custom-check {
  padding-top: $font-size-base * 2;
}

label {
  font-weight: $font-weight-bold;
}
</style>
