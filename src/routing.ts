import Vue from "vue";
import VueRouter from "vue-router";
import Addresses from "@/components/Addresses.vue";
import TreffenView from "@/components/TreffenView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: "/", redirect: "/adressen" },
    { path: "/adressen", redirect: "/adressen/0" },
    { path: "/adressen/:id", component: Addresses },
    { path: "/treffen", component: TreffenView }
  ]
});
