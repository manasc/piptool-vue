import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "base",
  //   component: () => import("../views/Base.vue"),
  // },
  {
    path: "/",
    name: "customize",
    component: () => import("../views/Customize.vue"),
  },
  {
    path: "/name-it",
    name: "name-it",
    component: () => import("../views/NameIt.vue"),
  },
  {
    path: "/thank-you",
    name: "thank-you",
    component: () => import("../views/ThankYou.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
