import Vue from "vue";
import VueRouter from "vue-router";
import AddressesView from "@/components/AddressesView.vue";
import TreffenView from "@/components/TreffenView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/", redirect: "/adressen" },
    { path: "/adressen", redirect: "/adressen/0" },
    { path: "/adressen/:id", component: AddressesView },
    { path: "/treffen", redirect: "/treffen/0" },
    { path: "/treffen/:id", component: TreffenView }
  ]
});
