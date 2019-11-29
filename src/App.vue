<template lang="pug">
  #app
    b-navbar(variant="primary", type="dark", fixed="top")
      b-navbar-brand.col-md-3 MCB Bruhrain e.V.
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav
          b-nav-item(to="/adressen", active-class="active") Adressen
          b-nav-item(to="/treffen", active-class="active") Treffen
    .container-fluid
      .row
        .col-12(style="padding-top: 64px")
          router-view
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import { Route } from "vue-router";
import { addresses, treffen } from "@/store/store";

@Component
export default class App extends Vue {
  @treffen.Action getAllTreffen: any;
  @addresses.Action getAllAddresses: any;
  @Action routeChanged: any;

  created() {
    this.getAllTreffen();
    this.getAllAddresses();
  }

  @Watch("$route")
  routeChange(route: Route) {
    this.routeChanged(route);
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

@import "~@fortawesome/fontawesome-free/css/all.css";
.custom-check {
  padding-top: $font-size-base * 2;
}

label {
  font-weight: $font-weight-bold;
}
</style>
