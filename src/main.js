import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("uppercase", function(value) {
  if (!value) return "";
  return value.toString().toUpperCase();
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
