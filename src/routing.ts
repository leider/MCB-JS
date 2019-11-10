import Vue from "vue";
import VueRouter from "vue-router";
import Addresses from "@/components/Addresses.vue";
import TreffenView from "@/components/TreffenView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: "/", redirect: "/addressesView" },
    { path: "/addressesView", component: Addresses },
    { path: "/treffenView", component: TreffenView }
  ]
});
