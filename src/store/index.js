import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import appData from "../assets/appData.json";
import drinks from "../assets/drinks.json";

export default new Vuex.Store({
  state: {
    appData,
    drinks,
    customerData: {}
  },
  mutations: {},
  actions: {},
  modules: {}
});
